from flask_socketio import (
    SocketIO,
    emit,
    join_room,
    leave_room,
    disconnect,
)
import flask_socketio
from flask import session
from flask_jwt_extended import decode_token
from sqlalchemy import or_
from ..models.user import User
from ..models.chat_room import ChatRoom
from ..models.message import Message
from .. import g

# Dictionary to track user rooms and typing status
user_rooms = {}
typing_users = {}


def init_messaging_socket(socketio):
    """Initialize messaging WebSocket events"""

    @socketio.on("connect")
    def handle_connect(auth):
        """Handle client connection"""
        try:
            # Verify JWT token
            token = auth.get("token") if auth else None
            if not token:
                print("No token provided")
                disconnect()
                return False

            # Decode token to get user ID
            decoded_token = decode_token(token)
            user_id = decoded_token["sub"]

            # Get user from database
            user = g.session.query(User).filter_by(id=user_id).first()
            if not user:
                print("User not found")
                disconnect()
                return False

            # Store user info in session
            session["user_id"] = user_id
            session["user_name"] = f"{user.first_name} {user.last_name}"

            print(f"User {user_id} connected to messaging")

            # Join user to their chat rooms automatically
            chat_rooms = (
                g.session.query(ChatRoom)
                .filter(
                    or_(ChatRoom.tenant_id == user_id, ChatRoom.landlord_id == user_id)
                )
                .all()
            )

            user_rooms[flask_socketio.request.sid] = []
            for room in chat_rooms:
                join_room(room.id)
                user_rooms[flask_socketio.request.sid].append(room.id)

            emit("connected", {"message": "Connected to messaging server"})

        except Exception as e:
            print(f"Connection error: {str(e)}")
            disconnect()
            return False

    @socketio.on("disconnect")
    def handle_disconnect():
        """Handle client disconnection"""
        try:
            user_id = session.get("user_id")
            if user_id:
                print(f"User {user_id} disconnected from messaging")

                # Clean up typing indicators
                if flask_socketio.request.sid in typing_users:
                    for room_id in typing_users[flask_socketio.request.sid]:
                        emit(
                            "user_stopped_typing",
                            {
                                "user_id": user_id,
                                "user_name": session.get("user_name"),
                                "chat_room_id": room_id,
                            },
                            room=room_id,
                        )
                    del typing_users[flask_socketio.request.sid]

                # Clean up room tracking
                if flask_socketio.request.sid in user_rooms:
                    del user_rooms[flask_socketio.request.sid]

        except Exception as e:
            print(f"Disconnect error: {str(e)}")

    @socketio.on("join_room")
    def handle_join_room(data):
        """Handle user joining a specific chat room"""
        try:
            user_id = session.get("user_id")
            chat_room_id = data.get("chat_room_id")

            if not user_id or not chat_room_id:
                return

            # Verify user has access to this chat room
            chat_room = (
                g.session.query(ChatRoom)
                .filter(
                    ChatRoom.id == chat_room_id,
                    or_(ChatRoom.tenant_id == user_id, ChatRoom.landlord_id == user_id),
                )
                .first()
            )

            if not chat_room:
                emit("error", {"message": "Access denied to chat room"})
                return

            join_room(chat_room_id)

            # Track user rooms
            if flask_socketio.request.sid not in user_rooms:
                user_rooms[flask_socketio.request.sid] = []
            if chat_room_id not in user_rooms[flask_socketio.request.sid]:
                user_rooms[flask_socketio.request.sid].append(chat_room_id)

            emit("joined_room", {"chat_room_id": chat_room_id})

        except Exception as e:
            emit("error", {"message": str(e)})

    @socketio.on("leave_room")
    def handle_leave_room(data):
        """Handle user leaving a specific chat room"""
        try:
            user_id = session.get("user_id")
            chat_room_id = data.get("chat_room_id")

            if not user_id or not chat_room_id:
                return

            leave_room(chat_room_id)

            # Stop typing if user was typing
            if (
                flask_socketio.request.sid in typing_users
                and chat_room_id in typing_users[flask_socketio.request.sid]
            ):
                typing_users[flask_socketio.request.sid].remove(chat_room_id)
                emit(
                    "user_stopped_typing",
                    {
                        "user_id": user_id,
                        "user_name": session.get("user_name"),
                        "chat_room_id": chat_room_id,
                    },
                    room=chat_room_id,
                )

            # Remove from tracked rooms
            if (
                flask_socketio.request.sid in user_rooms
                and chat_room_id in user_rooms[flask_socketio.request.sid]
            ):
                user_rooms[flask_socketio.request.sid].remove(chat_room_id)

            emit("left_room", {"chat_room_id": chat_room_id})

        except Exception as e:
            emit("error", {"message": str(e)})

    @socketio.on("typing")
    def handle_typing(data):
        """Handle user typing indicator"""
        try:
            user_id = session.get("user_id")
            user_name = session.get("user_name")
            chat_room_id = data.get("chat_room_id")

            if not user_id or not chat_room_id:
                return

            # Track typing status
            if flask_socketio.request.sid not in typing_users:
                typing_users[flask_socketio.request.sid] = set()
            typing_users[flask_socketio.request.sid].add(chat_room_id)

            # Emit to other users in the room
            emit(
                "user_typing",
                {
                    "user_id": user_id,
                    "user_name": user_name,
                    "chat_room_id": chat_room_id,
                },
                room=chat_room_id,
                include_self=False,
            )

        except Exception as e:
            emit("error", {"message": str(e)})

    @socketio.on("stopped_typing")
    def handle_stopped_typing(data):
        """Handle user stopped typing indicator"""
        try:
            user_id = session.get("user_id")
            user_name = session.get("user_name")
            chat_room_id = data.get("chat_room_id")

            if not user_id or not chat_room_id:
                return

            # Remove from typing status
            if (
                flask_socketio.request.sid in typing_users
                and chat_room_id in typing_users[flask_socketio.request.sid]
            ):
                typing_users[flask_socketio.request.sid].remove(chat_room_id)

            # Emit to other users in the room
            emit(
                "user_stopped_typing",
                {
                    "user_id": user_id,
                    "user_name": user_name,
                    "chat_room_id": chat_room_id,
                },
                room=chat_room_id,
                include_self=False,
            )

        except Exception as e:
            emit("error", {"message": str(e)})

    @socketio.on("mark_read")
    def handle_mark_read(data):
        """Handle marking messages as read"""
        try:
            user_id = session.get("user_id")
            chat_room_id = data.get("chat_room_id")
            message_ids = data.get("message_ids", [])

            if not user_id or not chat_room_id:
                return

            # Update message read status
            if message_ids:
                g.session.query(Message).filter(
                    Message.id.in_(message_ids), Message.sender_id != user_id
                ).update({"is_read": True}, synchronize_session=False)
            else:
                # Mark all unread messages in the chat room as read
                g.session.query(Message).filter(
                    Message.chat_room_id == chat_room_id,
                    Message.sender_id != user_id,
                    Message.is_read == False,
                ).update({"is_read": True}, synchronize_session=False)

            g.session.commit()

            # Emit to other users in the room
            emit(
                "messages_read",
                {
                    "user_id": user_id,
                    "chat_room_id": chat_room_id,
                    "message_ids": message_ids,
                },
                room=chat_room_id,
                include_self=False,
            )

        except Exception as e:
            g.session.rollback()
            emit("error", {"message": str(e)})


def emit_new_message(socketio, message, chat_room_id):
    """Emit new message to chat room"""
    try:
        socketio.emit(
            "new_message",
            {
                "id": message.id,
                "content": message.content,
                "message_type": message.message_type,
                "file_path": message.file_path,
                "file_name": message.file_name,
                "file_size": message.file_size,
                "file_type": message.file_type,
                "metadata": message.message_metadata,
                "sender": {
                    "id": message.sender.id,
                    "name": f"{message.sender.first_name} {message.sender.last_name}",
                    "profile_picture": message.sender.profile_picture,
                    "user_type": message.sender.user_type,
                },
                "timestamp": message.timestamp.isoformat(),
                "chat_room_id": chat_room_id,
            },
            room=chat_room_id,
        )
    except Exception as e:
        print(f"Error emitting new message: {str(e)}")


def emit_message_edited(socketio, message, chat_room_id):
    """Emit message edited event to chat room"""
    try:
        socketio.emit(
            "message_edited",
            {
                "id": message.id,
                "content": message.content,
                "is_edited": message.is_edited,
                "edited_at": (
                    message.edited_at.isoformat() if message.edited_at else None
                ),
                "chat_room_id": chat_room_id,
            },
            room=chat_room_id,
        )
    except Exception as e:
        print(f"Error emitting message edited: {str(e)}")


def emit_message_deleted(socketio, message_id, chat_room_id):
    """Emit message deleted event to chat room"""
    try:
        socketio.emit(
            "message_deleted",
            {"message_id": message_id, "chat_room_id": chat_room_id},
            room=chat_room_id,
        )
    except Exception as e:
        print(f"Error emitting message deleted: {str(e)}")

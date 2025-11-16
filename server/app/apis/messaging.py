from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from sqlalchemy import or_, desc
from ..models.message import Message
from ..models.chat_room import ChatRoom
from ..models.user import User
from ..models.property import Property
from ..utils.helpers import get_logged_in_user, response
from ..utils.uploader import upload_file
from ..models.db_utils import create_item, get_item_by_id, get_paginated_items
from ..utils.file_validator import validate_file
from ..utils.errors import CustomRequestError
from ..utils.messaging_socket import (
    emit_new_message,
    emit_message_edited,
    emit_message_deleted,
)
from .. import socketio
import mimetypes
from functools import wraps
import logging


def login_required(f):
    """Custom login required decorator"""

    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            if not user_id:
                raise CustomRequestError("Authentication required", 401)

            user = get_item_by_id(g.session, User, user_id)
            if not user:
                raise CustomRequestError("User not found", 404)

            g.current_user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 401

    return decorated_function


messaging_bp = Blueprint("messaging", __name__)


# Get all chat rooms for the current user
@messaging_bp.route("/chat-rooms", methods=["GET"])
@login_required
def get_chat_rooms():
    try:
        user_id, user, _ = get_logged_in_user()
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 20, type=int), 100)

        # Get chat rooms where user is either tenant or landlord
        base_query = (
            g.session.query(ChatRoom)
            .filter(
                or_(ChatRoom.tenant_id == user_id, ChatRoom.landlord_id == user_id),
                ChatRoom.is_active == True,
            )
            .order_by(desc(ChatRoom.last_message_at))
        )

        # Calculate offset for manual pagination
        offset = (page - 1) * per_page
        total_items = base_query.count()
        chat_rooms_list = base_query.offset(offset).limit(per_page).all()
        total_pages = (total_items + per_page - 1) // per_page

        paginated = {
            "items": chat_rooms_list,
            "total": total_items,
            "pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }

        chat_rooms = []
        for room in paginated["items"]:
            # Get the other participant
            other_user = room.tenant if room.landlord_id == user_id else room.landlord

            # Get last message
            last_message = room.last_message

            # Get unread count for current user
            unread_count = (
                g.session.query(Message)
                .filter(
                    Message.chat_room_id == room.id,
                    Message.sender_id != user_id,
                    Message.is_read == False,
                )
                .count()
            )

            chat_room_data = {
                "id": room.id,
                "participant": {
                    "id": other_user.id,
                    "name": f"{other_user.firstName} {other_user.lastName}",
                    "email": other_user.email,
                    "profile_picture": other_user.profile_picture,
                    "user_type": other_user.role,
                },
                "property": None,
                "last_message": None,
                "unread_count": unread_count,
                "created_at": room.created_at.isoformat(),
                "last_message_at": (
                    room.last_message_at.isoformat() if room.last_message_at else None
                ),
            }

            # Add property info if available
            if room.property:
                chat_room_data["property"] = {
                    "id": room.property.id,
                    "name": room.property.name,
                    "address": room.property.address,
                    "cover_image": room.property.cover_image,
                }

            # Add last message info
            if last_message:
                chat_room_data["last_message"] = {
                    "id": last_message.id,
                    "content": (
                        last_message.content[:100] + "..."
                        if len(last_message.content or "") > 100
                        else last_message.content
                    ),
                    "message_type": last_message.message_type,
                    "sender_name": f"{last_message.sender.firstName} {last_message.sender.lastName}",
                    "timestamp": last_message.timestamp.isoformat(),
                    "is_own_message": last_message.sender_id == user_id,
                }

            chat_rooms.append(chat_room_data)

        return response(
            "Chat rooms retrieved successfully",
            {
                "chat_rooms": chat_rooms,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": paginated["total"],
                    "pages": paginated["pages"],
                    "has_next": paginated["has_next"],
                    "has_prev": paginated["has_prev"],
                },
            },
        )

    except Exception as e:
        logging.error(f"Error retrieving chat rooms: {e}")
        raise CustomRequestError("Failed to retrieve chat rooms", 500)


# Create or get existing chat room
@messaging_bp.route("/chat-rooms", methods=["POST"])
@login_required
def create_or_get_chat_room():
    try:
        data = request.get_json()
        participant_id = data.get("participant_id")
        property_id = data.get("property_id")  # Optional
        user_id, user, _ = get_logged_in_user()

        if not participant_id:
            raise CustomRequestError("Participant ID is required", 400)

        # Check if participant exists
        participant = get_item_by_id(g.session, User, participant_id)
        if not participant:
            raise CustomRequestError("Participant not found", 404)

        # Determine who is tenant and who is landlord
        if user.role == "landlord" and participant.role == "tenant":
            landlord_id = user_id
            tenant_id = participant_id
        elif user.role == "tenant" and participant.role == "landlord":
            landlord_id = participant_id
            tenant_id = user_id
        else:
            raise CustomRequestError("Invalid participant roles", 400)

        # Check if chat room already exists
        existing_room = (
            g.session.query(ChatRoom)
            .filter(
                ChatRoom.tenant_id == tenant_id,
                ChatRoom.landlord_id == landlord_id,
                (
                    ChatRoom.property_id == property_id
                    if property_id
                    else ChatRoom.property_id.is_(None)
                ),
            )
            .first()
        )

        if existing_room:
            return response(
                "Room is already exisiting", {"chat_room_id": existing_room.id}
            )

        # Create new chat room
        new_room = create_item(
            g.session,
            ChatRoom,
            {
                "tenant_id": tenant_id,
                "landlord_id": landlord_id,
                "property_id": property_id,
            },
        )

        return response("Chat room created successfully", {"chat_room_id": new_room.id})

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error getting or creating chat room: {e}")
        raise CustomRequestError("Failed to crete or get chat room", 500)


# Get messages for a specific chat room
@messaging_bp.route("/chat-rooms/<chat_room_id>/messages", methods=["GET"])
@login_required
def get_messages(chat_room_id):
    try:
        user_id, user, _ = get_logged_in_user()
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 50, type=int), 100)

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
            raise CustomRequestError("Chat room not found", 404)

        # Get messages
        base_query = (
            g.session.query(Message)
            .filter(Message.chat_room_id == chat_room_id)
            .order_by(desc(Message.timestamp))
        )

        # Calculate offset for manual pagination
        offset = (page - 1) * per_page
        total_items = base_query.count()
        messages_list = base_query.offset(offset).limit(per_page).all()
        total_pages = (total_items + per_page - 1) // per_page

        paginated = {
            "items": messages_list,
            "total": total_items,
            "pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }

        messages = []
        for message in reversed(paginated["items"]):  # Reverse to show oldest first
            messages.append(
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
                        "name": f"{message.sender.firstName} {message.sender.lastName}",
                        "profile_picture": message.sender.profile_picture,
                        "user_type": message.sender.role,
                    },
                    "is_own_message": message.sender_id == user_id,
                    "is_read": message.is_read,
                    "is_edited": message.is_edited,
                    "edited_at": (
                        message.edited_at.isoformat() if message.edited_at else None
                    ),
                    "timestamp": message.timestamp.isoformat(),
                }
            )

        # Mark messages as read for current user
        g.session.query(Message).filter(
            Message.chat_room_id == chat_room_id,
            Message.sender_id != user_id,
            Message.is_read == False,
        ).update({"is_read": True})
        g.session.commit()

        return response(
            "Messages retrieved successfully",
            {
                "messages": messages,
                "chat_room": {
                    "id": chat_room.id,
                    "participant": {
                        "id": (
                            chat_room.tenant.id
                            if chat_room.landlord_id == user_id
                            else chat_room.landlord.id
                        ),
                        "name": (
                            f"{chat_room.tenant.firstName} {chat_room.tenant.lastName}"
                            if chat_room.landlord_id == user_id
                            else f"{chat_room.landlord.firstName} {chat_room.landlord.lastName}"
                        ),
                        "user_type": (
                            chat_room.tenant.role
                            if chat_room.landlord_id == user_id
                            else chat_room.landlord.role
                        ),
                    },
                },
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": paginated["total"],
                    "pages": paginated["pages"],
                    "has_next": paginated["has_next"],
                    "has_prev": paginated["has_prev"],
                },
            },
        )

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error retrieving messages: {e}")
        raise CustomRequestError("Failed to retrieve messages", 500)


# Send a message
@messaging_bp.route("/chat-rooms/<chat_room_id>/messages", methods=["POST"])
@login_required
def send_message(chat_room_id):
    try:
        user_id, user, _ = get_logged_in_user()

        # Verify user has access to this chat room
        chat_room = get_item_by_id(g.session, ChatRoom, chat_room_id)
        if not chat_room or not (
            chat_room.tenant_id == user_id or chat_room.landlord_id == user_id
        ):
            raise CustomRequestError("Chat room not found", 404)

        content = request.form.get("content")
        message_type = request.form.get("message_type", "text")
        file = request.files.get("file")

        if not content and not file:
            raise CustomRequestError("Message content or file is required", 400)

        # Handle file upload
        file_path = None
        file_name = None
        file_size = None
        file_type = None
        metadata = {}

        if file and file.filename:
            # Validate file
            validation_result = validate_file(file)
            if not validation_result["valid"]:
                raise CustomRequestError(validation_result["message"], 400)

            # Upload file
            upload_result = upload_file(file, folder="messages")
            if upload_result["success"]:
                file_path = upload_result["url"]
                file_name = secure_filename(file.filename)
                file_size = str(file.content_length or 0)
                file_type = file.content_type or mimetypes.guess_type(file.filename)[0]
                message_type = "file"

                # Set metadata based on file type
                if file_type and file_type.startswith("image/"):
                    message_type = "image"
                elif file_type and file_type in [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ]:
                    message_type = "document"

                metadata = {
                    "original_name": file.filename,
                    "size_readable": (
                        f"{int(file_size) / 1024:.1f} KB"
                        if int(file_size) < 1024 * 1024
                        else f"{int(file_size) / (1024*1024):.1f} MB"
                    ),
                }
            else:
                raise CustomRequestError("File upload failed", 500)

        # Create message
        new_message = create_item(
            g.session,
            Message,
            {
                "chat_room_id": chat_room_id,
                "sender_id": user_id,
                "content": content,
                "message_type": message_type,
                "file_path": file_path,
                "file_name": file_name,
                "file_size": file_size,
                "file_type": file_type,
                "message_metadata": metadata,
            },
        )

        # Update chat room last message time
        chat_room.last_message_at = datetime.utcnow()
        g.session.commit()

        # Emit real-time event for new message
        if socketio:
            emit_new_message(socketio, new_message, chat_room_id)

        # Return the created message
        return response(
            "Message sent successfully",
            {
                "message": {
                    "id": new_message.id,
                    "content": new_message.content,
                    "message_type": new_message.message_type,
                    "file_path": new_message.file_path,
                    "file_name": new_message.file_name,
                    "file_size": new_message.file_size,
                    "file_type": new_message.file_type,
                    "metadata": new_message.message_metadata,
                    "sender": {
                        "id": user.id,
                        "name": f"{user.firstName} {user.lastName}",
                        "profile_picture": user.profile_picture,
                        "user_type": user.role,
                    },
                    "is_own_message": True,
                    "is_read": False,
                    "timestamp": new_message.timestamp.isoformat(),
                }
            },
            201,
        )

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error sending message: {e}")
        raise CustomRequestError("Failed to send message", 500)

    except Exception as e:
        g.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# Delete a message
@messaging_bp.route("/messages/<message_id>", methods=["DELETE"])
@login_required
def delete_message(message_id):
    try:
        user_id, user, _ = get_logged_in_user()

        message = get_item_by_id(g.session, Message, message_id)
        if not message or message.sender_id != user_id:
            raise CustomRequestError("Message not found", 404)

        chat_room_id = message.chat_room_id

        g.session.delete(message)
        g.session.commit()

        # Emit real-time event for message deletion
        if socketio:
            emit_message_deleted(socketio, message_id, chat_room_id)

        return response("Message deleted successfully")

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error deleting message: {e}")
        raise CustomRequestError("Failed to delete message", 500)


# Edit a message
@messaging_bp.route("/messages/<message_id>", methods=["PUT"])
@login_required
def edit_message(message_id):
    try:
        user_id, user, _ = get_logged_in_user()
        data = request.get_json()
        new_content = data.get("content")

        if not new_content:
            raise CustomRequestError("Content is required", 400)

        message = (
            g.session.query(Message)
            .filter(
                Message.id == message_id,
                Message.sender_id == user_id,
                Message.message_type == "text",  # Only allow editing text messages
            )
            .first()
        )

        if not message:
            raise CustomRequestError("Message not found or cannot be edited", 404)

        message.content = new_content
        message.is_edited = True
        message.edited_at = datetime.utcnow()

        g.session.commit()

        # Emit real-time event for message edit
        if socketio:
            emit_message_edited(socketio, message, message.chat_room_id)

        return response(
            "Message updated successfully",
            {
                "message": {
                    "id": message.id,
                    "content": message.content,
                    "is_edited": message.is_edited,
                    "edited_at": message.edited_at.isoformat(),
                }
            },
        )

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error editing message: {e}")
        raise CustomRequestError("Failed to edit message", 500)


# Mark messages as read
@messaging_bp.route("/chat-rooms/<chat_room_id>/mark-read", methods=["POST"])
@login_required
def mark_messages_read(chat_room_id):
    try:
        user_id, user, _ = get_logged_in_user()

        # Verify user has access to this chat room
        chat_room = get_item_by_id(g.session, ChatRoom, chat_room_id)
        if not chat_room or not (
            chat_room.tenant_id == user_id or chat_room.landlord_id == user_id
        ):
            raise CustomRequestError("Chat room not found", 404)

        # Mark all unread messages as read
        updated_count = (
            g.session.query(Message)
            .filter(
                Message.chat_room_id == chat_room_id,
                Message.sender_id != user_id,
                Message.is_read == False,
            )
            .update({"is_read": True})
        )

        g.session.commit()

        return response("Messages marked as read", {"marked_read": updated_count})

    except Exception as e:
        g.session.rollback()
        logging.error(f"Error marking messages as read: {e}")
        raise CustomRequestError("Failed to mark messages as read", 500)

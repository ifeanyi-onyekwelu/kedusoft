from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
import datetime
from .db_utils import generate_id
from . import BaseModel


class Message(BaseModel):
    __tablename__ = "messages"

    id = Column(String(20), primary_key=True, default=generate_id)
    chat_room_id = Column(String(20), ForeignKey("chat_rooms.id"), nullable=False)
    sender_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    content = Column(Text)
    message_type = Column(String(20), default="text")  # text, file, image, document
    file_path = Column(String(255))
    file_name = Column(String(255))
    file_size = Column(String(50))
    file_type = Column(String(100))
    message_metadata = Column(JSON)  # For additional file or message metadata
    is_read = Column(Boolean, default=False)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    chat_room = relationship("ChatRoom", backref="messages")
    sender = relationship("User", backref="messages_sent")

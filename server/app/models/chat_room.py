from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
import datetime
from .db_utils import generate_id
from . import BaseModel
from .. import g


class ChatRoom(BaseModel):
    __tablename__ = "chat_rooms"

    id = Column(String(20), primary_key=True, default=generate_id)
    tenant_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    landlord_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    property_id = Column(
        String(20), ForeignKey("properties.id"), nullable=True
    )  # Optional property context
    is_active = Column(Boolean, default=True)
    last_message_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship(
        "User", foreign_keys=[tenant_id], backref="chat_rooms_as_tenant"
    )
    landlord = relationship(
        "User", foreign_keys=[landlord_id], backref="chat_rooms_as_landlord"
    )
    property = relationship("Property", backref="chat_rooms")

    @hybrid_property
    def last_message(self):
        from .message import Message

        return (
            g.session.query(Message)
            .filter(Message.chat_room_id == self.id)
            .order_by(Message.timestamp.desc())
            .first()
        )

    @hybrid_property
    def unread_count(self):
        from .message import Message

        return (
            g.session.query(Message)
            .filter(Message.chat_room_id == self.id, Message.is_read == False)
            .count()
        )

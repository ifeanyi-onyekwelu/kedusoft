from sqlalchemy import Column, String, Text, DateTime, ForeignKey, SmallInteger
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class Notification(BaseModel):
    __tablename__ = "notifications"

    id = Column(String(20), primary_key=True, default=generate_id)
    title = Column(String(255))
    content = Column(Text)
    is_seen = Column(SmallInteger, default=0)
    recipient_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    recipient_type = Column(String(20), nullable=False)
    property_id = Column(String(20), ForeignKey("properties.id"), nullable=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    # Optional: Define relationship if you want to connect to the property
    recipient = relationship(
        "User", foreign_keys=[recipient_id], backref="notifications"
    )
    property = relationship("Property", backref="notifications")

from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from . import BaseModel
from .db_utils import generate_id


class NotificationPreference(BaseModel):
    __tablename__ = "notification_preferences"

    id = Column(String(20), primary_key=True, default=generate_id)
    user_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    notification_type = Column(String(50))
    is_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

    user = relationship("User", backref="notification_preferences")

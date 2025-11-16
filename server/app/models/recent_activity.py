# models/recent_activity.py
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
import datetime
from .db_utils import generate_id
from . import BaseModel


class RecentActivity(BaseModel):
    __tablename__ = "recent_activities"

    id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    user_role = Column(String(20), nullable=False)  # 'tenant' or 'landlord'
    activity_type = Column(
        String(100), nullable=False
    )  # e.g., 'property_applied', 'lease_signed'
    activity_description = Column(Text, nullable=False)
    related_entity_type = Column(String(50))  # e.g., 'property', 'application', 'lease'
    related_entity_id = Column(String(50))  # ID of the related entity
    ip_address = Column(String(45))  # Store IP address for audit
    user_agent = Column(Text)  # Store user agent
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", backref="recent_activities")

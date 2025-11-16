from sqlalchemy import (
    Column,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
from datetime import datetime


class LikedProperty(BaseModel):
    __tablename__ = "liked_properties"

    id = Column(String(50), primary_key=True, default=generate_id)
    tenant_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    property_id = Column(String(50), ForeignKey("properties.id"), nullable=False)
    date_liked = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tenant = relationship("User", backref="liked_properties")
    property = relationship("Property", backref="liked_by")

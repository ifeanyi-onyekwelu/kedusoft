from sqlalchemy import Column, String, DateTime, ForeignKey, Text
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class PropertyView(BaseModel):
    __tablename__ = "property_views"

    id = Column(String(50), primary_key=True, default=generate_id)
    property_id = Column(String(50), ForeignKey("properties.id"), nullable=False)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    viewed_at = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String(50))
    user_agent = Column(Text)

    # Relationships
    property = relationship("Property", backref="views")
    user = relationship("User", backref="viewed_properties")

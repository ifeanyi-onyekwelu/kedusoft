from sqlalchemy import Column, String, Integer, Float, Date, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from . import BaseModel
from .db_utils import generate_id
from datetime import datetime


class PropertyDraft(BaseModel):
    __tablename__ = "property_drafts"

    id = Column(String(50), primary_key=True, default=generate_id)
    landlord_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=True)
    name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    parking_space = Column(Integer, nullable=True)
    furnished = Column(String(50), nullable=True)
    pets = Column(String(50), nullable=True)
    kitchens = Column(Integer, nullable=True)
    floors_no = Column(Integer, nullable=True)
    size_sqft = Column(Float, nullable=True)
    year_built = Column(Integer, nullable=True)
    cover_image = Column(String(255), nullable=True)
    gallery = Column(ARRAY(String), nullable=True)
    address = Column(String(255), nullable=True)
    street = Column(String(100), nullable=True)
    closest_landmark = Column(String(100), nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    zipcode = Column(Integer, nullable=True)
    payment_structure = Column(String(20), nullable=True)
    rent_amount = Column(Integer, nullable=True)
    available_from = Column(Date, nullable=True)
    minimum_lease_duration = Column(String(20), nullable=True)
    service_charge = Column(Integer, nullable=True)
    security_deposit = Column(Integer, nullable=True)

    last_saved_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    landlord = relationship("User", backref="property_drafts")
    category = relationship("Category")

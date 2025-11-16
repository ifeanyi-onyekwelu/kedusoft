from sqlalchemy import Column, String, Float, Integer, Date, JSON, DateTime, ForeignKey
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class Recommendation(BaseModel):
    __tablename__ = "recommendations"

    recommendation_id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    min_budget = Column(Float)
    max_budget = Column(Float)
    preferred_bedrooms = Column(Integer)
    preferred_bathrooms = Column(Integer)
    preferred_parking_space = Column(String(50))
    preferred_furnished = Column(String(50))
    preferred_pets = Column(String(50))
    preferred_kitchens = Column(Integer)
    preferred_floors_no = Column(Integer)
    preferred_size_sqft = Column(Float)
    preferred_year_built = Column(Integer)
    preferred_min_lease = Column(String(20))
    preferred_amenities = Column(JSON)
    preferred_locations = Column(JSON)
    preferred_payment_frequency = Column(String(20))
    preferred_move_in_date = Column(Date)
    property_category = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", backref="recommendations")

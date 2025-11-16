from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class Review(BaseModel):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, default=generate_id)
    user_id = Column(String(20), ForeignKey("users.id"))
    is_deleted = Column(Integer, default=0)
    property_id = Column(String(20), ForeignKey("properties.id"))
    rating = Column(Integer, nullable=False)
    feedback = Column(Text)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    # Add relationships
    user = relationship("User", backref="reviews")
    property = relationship("Property", backref="reviews")

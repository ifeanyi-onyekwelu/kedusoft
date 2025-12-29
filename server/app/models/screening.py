from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class Screening(BaseModel):
    __tablename__ = "screenings"

    id = Column(String(20), primary_key=True, default=generate_id)
    application_id = Column(String(20), ForeignKey("applications.id"), nullable=False)
    tenant_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    landlord_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    property_id = Column(String(20), ForeignKey("properties.id"), nullable=False)
    bio_data = Column(JSON)
    invitation_date = Column(DateTime)
    screening_date = Column(DateTime)
    status = Column(String(50), default="in-progress")
    decline_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("User", foreign_keys=[tenant_id])
    landlord = relationship("User", foreign_keys=[landlord_id])
    property = relationship("Property", backref="screenings")

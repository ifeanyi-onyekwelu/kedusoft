from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .db_utils import generate_id
from . import BaseModel


class Application(BaseModel):
    __tablename__ = "applications"

    id = Column(String(50), primary_key=True, default=generate_id)
    property_id = Column(String(50), ForeignKey("properties.id"))
    applicant_id = Column(String(50), ForeignKey("users.id"))  # Changed from tenant_id
    tenant_id = Column(
        String(50), ForeignKey("users.id")
    )  # Kept for backward compatibility

    # Application details
    employment_status = Column(
        String(50)
    )  # employed, student, self-employed, unemployed
    number_of_occupants = Column(String(10))
    move_in_date = Column(DateTime, nullable=True)
    message = Column(String(1000))  # Notes for landlord

    # Application process
    status = Column(
        String(50), default="received"
    )  # received, under_review, tour_scheduled, accepted, rejected
    created_at = Column(DateTime, default=datetime.datetime.now)
    viewed_at = Column(DateTime, nullable=True)

    # Tour scheduling
    tour_date = Column(DateTime, nullable=True)
    tour_confirmed = Column(String(10), default="pending")  # pending/confirmed/declined

    # Relationships
    applicant = relationship(
        "User", foreign_keys=[applicant_id], backref="submitted_applications"
    )
    tenant = relationship(
        "User", foreign_keys=[tenant_id], backref="applications"
    )  # Kept for backward compatibility
    property = relationship("Property", backref="applications")

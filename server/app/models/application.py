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

    # Snapshot of details
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(150))
    phone = Column(String(50))
    message = Column(String(500))

    # Application process
    status = Column(
        String(50), default="received"
    )  # received, under_review, tour_scheduled, accepted, rejected
    created_at = Column(DateTime, default=datetime.datetime.now)
    viewed_at = Column(DateTime, nullable=True)

    # Tour scheduling
    tour_date = Column(DateTime, nullable=True)
    tour_confirmed = Column(String(10), default="pending")  # pending/confirmed/declined

    # Optional extra
    preferred_move_in = Column(DateTime, nullable=True)
    documents_url = Column(String(255), nullable=True)

    # Relationships
    applicant = relationship(
        "User", foreign_keys=[applicant_id], backref="submitted_applications"
    )
    tenant = relationship(
        "User", foreign_keys=[tenant_id], backref="applications"
    )  # Kept for backward compatibility
    property = relationship("Property", backref="applications")

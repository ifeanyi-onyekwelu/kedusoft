"""Landlord-specific information model"""

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Date,
    Integer,
    Boolean,
    Text,
    JSON,
    ForeignKey,
    Numeric,
)
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import datetime


class LandlordInfo(BaseModel):
    """Stores landlord-specific information separately from base user"""

    __tablename__ = "landlord_info"

    id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(
        String(50), ForeignKey("users.id"), nullable=False, unique=True, index=True
    )

    # Business Information
    company_name = Column(String(200))
    business_registration_number = Column(String(100))
    business_type = Column(String(50))
    years_as_landlord = Column(Integer)

    # Property Ownership
    property_ownership_docs = Column(JSON)  # Array of document URLs
    deed_or_title_document = Column(String(255))
    property_tax_receipt = Column(String(255))

    # Tax Information
    tax_identification_number = Column(String(50))
    tax_document = Column(String(255))

    # Address Verification
    utility_bill = Column(String(255))  # Proof of address

    # Emergency Contact
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(15))
    emergency_contact_relationship = Column(String(50))

    # Legal & Compliance
    has_eviction_history = Column(Boolean, default=False)
    eviction_history_details = Column(Text)
    criminal_background = Column(Boolean, default=False)
    criminal_background_details = Column(Text)

    # Professional References
    references = Column(JSON)  # Array of references
    previous_tenant_references = Column(JSON)

    # Verification Status
    verification_status = Column(
        String(20), default="not_started"
    )  # not_started, pending, approved, rejected
    verification_submitted_at = Column(DateTime)
    verification_reviewed_at = Column(DateTime)
    verification_reviewed_by = Column(String(50))
    verification_notes = Column(Text)
    verification_attempts = Column(Integer, default=0)

    # Onboarding
    onboarding_step = Column(Integer, default=1)
    is_onboarded = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="landlord_info")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

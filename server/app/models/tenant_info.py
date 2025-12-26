"""Tenant-specific information model"""

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Date,
    Boolean,
    Text,
    JSON,
    ForeignKey,
    Numeric,
    Integer,
)
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import datetime


class TenantInfo(BaseModel):
    """Stores tenant-specific information separately from base user"""

    __tablename__ = "tenant_info"

    id = Column(String(36), primary_key=True, default=generate_id)
    user_id = Column(
        String(50), ForeignKey("users.id"), nullable=False, unique=True, index=True
    )

    # Employment Information
    employment_status = Column(
        String(50)
    )  # employed, self_employed, student, unemployed
    employment_start_date = Column(Date)
    employment_duration = Column(String(50))

    # Income Details
    income_source = Column(String(50))
    other_income_sources = Column(JSON)
    total_monthly_income = Column(Numeric(15, 2))

    # Financial History
    has_bankruptcy_history = Column(Boolean, default=False)
    bankruptcy_details = Column(Text)

    # Rental History
    previous_rental_history = Column(JSON)  # Array of past rentals
    current_landlord_reference = Column(String(255))
    previous_landlord_references = Column(JSON)
    rental_payment_proof = Column(JSON)

    # Background Checks
    tenant_background_check = Column(String(255))
    criminal_record_check = Column(String(255))

    # Legal Issues
    has_evictions = Column(Boolean, default=False)
    eviction_details = Column(Text)
    has_lease_violations = Column(Boolean, default=False)
    lease_violation_details = Column(Text)

    # Personal References
    personal_references = Column(JSON)  # Array of references
    emergency_contact = Column(JSON)  # Phone, name, relationship

    # Pet Information
    has_pets = Column(Boolean, default=False)
    pet_details = Column(JSON)

    # Application Preferences
    desired_move_in_date = Column(Date)
    lease_duration_preference = Column(String(50))  # 6 months, 1 year, etc.
    budget_range_min = Column(Numeric(15, 2))
    budget_range_max = Column(Numeric(15, 2))
    preferred_locations = Column(JSON)
    property_type_preferences = Column(JSON)

    # Consent & Agreements
    background_check_consent = Column(Boolean, default=False)
    credit_check_consent = Column(Boolean, default=False)
    data_processing_consent = Column(Boolean, default=False)
    terms_accepted = Column(Boolean, default=False)

    # Verification Status
    verification_status = Column(
        String(20), default="not_started"
    )  # not_started, pending, approved
    verification_score = Column(Integer)
    verification_submitted_at = Column(DateTime)
    verification_reviewed_at = Column(DateTime)
    verification_reviewed_by = Column(String(36))
    verification_notes = Column(Text)

    # Onboarding
    onboarding_step = Column(Integer, default=1)
    is_onboarded = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="tenant_info")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

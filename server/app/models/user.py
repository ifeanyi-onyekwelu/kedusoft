from sqlalchemy import Column, String, Date, Boolean, DateTime, Text, Integer, Numeric
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class User(BaseModel):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_id)
    firstName = Column(String(50))
    lastName = Column(String(50))
    middleName = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    date_of_birth = Column(Date)
    marital_status = Column(String(50))
    apartment_or_suite = Column(String(50))
    street = Column(String(50))
    street_address = Column(String(100))  # More detailed street address
    city = Column(String(50))
    state = Column(String(50))  # State/Province field
    country = Column(String(50))
    occupation = Column(String(100))  # Optional for basic profiles
    employment_status = Column(String(50))
    employer_name = Column(String(100))  # Employer company name
    monthly_income = Column(Numeric(15, 2))  # Monthly income amount
    annual_income = Column(Numeric(15, 2))  # Annual income amount
    phone_number = Column(String(15))
    password = Column(String(255), nullable=False)
    role = Column(String(50))  # tenant, landlord, admin (agent coming in v2)
    profile_picture = Column(String(255))
    identity_card = Column(String(255))
    national_id_card = Column(String(255))

    # Agent-specific fields (for future v2 implementation)
    agency_name = Column(String(100))  # Real estate agency name
    license_number = Column(String(50))  # Real estate license number
    years_of_experience = Column(Integer)  # Years in real estate
    specializations = Column(Text)  # JSON array of specializations
    service_areas = Column(Text)  # JSON array of cities/areas served
    commission_rate = Column(Numeric(5, 2))  # Commission percentage
    agent_bio = Column(Text)  # Professional bio
    professional_website = Column(String(255))  # Agent's website
    linkedin_url = Column(String(255))  # LinkedIn profile

    failed_login_attempts = Column(Integer, default=0)
    last_failed_login = Column(DateTime)
    last_successful_login = Column(DateTime)

    # Screening and verification fields
    screening_status = Column(
        String(50), default="not_started"
    )  # not_started, in_progress, completed, failed
    last_screened = Column(DateTime)

    verification_token = Column(Text)
    verification_code = Column(String(6))

    is_onboarded = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    is_suspended = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships for leases
    tenant_leases = relationship(
        "Lease",
        back_populates="tenant",
        foreign_keys="[Lease.tenant_id]",
        cascade="all, delete-orphan",
    )

    landlord_leases = relationship(
        "Lease",
        back_populates="landlord",
        foreign_keys="[Lease.landlord_id]",
        cascade="all, delete-orphan",
    )

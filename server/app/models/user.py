from sqlalchemy import (
    Column,
    String,
    Date,
    Boolean,
    DateTime,
    Text,
    Integer,
    Numeric,
    JSON,
)
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
    street_address = Column(String(100))
    city = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    phone_number = Column(String(15))
    password = Column(String(255), nullable=False)
    role = Column(String(50))
    profile_picture = Column(String(255))

    # ===== IDENTITY DOCUMENTS (For ALL users) =====
    identity_documents = Column(JSON)  # Array of identity document objects
    # Example structure:
    # [
    #   {"type": "national_id", "url": "url1", "verified": true},
    #   {"type": "driver_license", "url": "url2", "verified": false},
    #   {"type": "passport", "url": "url3", "verified": true}
    # ]

    # ===== LANDLORD VERIFICATION FIELDS =====

    # Business/Professional Information
    company_name = Column(String(200))
    business_registration_number = Column(String(100))
    business_type = Column(String(50))
    years_as_landlord = Column(Integer)

    # Property Ownership Proof
    property_ownership_docs = Column(JSON)  # Array of document URLs
    deed_or_title_document = Column(String(255))
    property_tax_receipt = Column(String(255))

    # Bank & Payment Information
    bank_name = Column(String(100))
    bank_account_number = Column(String(50))
    bank_routing_number = Column(String(50))
    account_holder_name = Column(String(100))
    bank_verification_document = Column(String(255))

    # Tax Information
    tax_identification_number = Column(String(50))
    tax_document = Column(String(255))

    # Additional Verification Documents
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

    # Verification Status & Tracking
    landlord_verification_submitted_at = Column(DateTime)
    landlord_verification_reviewed_at = Column(DateTime)
    landlord_verification_reviewed_by = Column(String(36))
    landlord_verification_notes = Column(Text)
    landlord_verification_attempts = Column(Integer, default=0)

    # Insurance Information
    insurance_provider = Column(String(100))
    insurance_policy_number = Column(String(100))
    insurance_expiry_date = Column(Date)
    insurance_document = Column(String(255))

    # Professional References
    references = Column(JSON)
    previous_tenant_references = Column(JSON)

    # ===== TENANT VERIFICATION FIELDS =====

    # Employment & Income Verification
    employment_start_date = Column(Date)
    employment_duration = Column(String(50))

    # Income Details
    income_source = Column(String(50))
    other_income_sources = Column(JSON)
    total_monthly_income = Column(Numeric(15, 2))

    # Credit & Financial Information
    has_bankruptcy_history = Column(Boolean, default=False)
    bankruptcy_details = Column(Text)

    # Rental History
    previous_rental_history = Column(JSON)
    current_landlord_reference = Column(String(255))
    previous_landlord_references = Column(JSON)
    rental_payment_proof = Column(JSON)

    # Background & Legal
    tenant_background_check = Column(String(255))
    criminal_record_check = Column(String(255))
    has_evictions = Column(Boolean, default=False)
    eviction_details = Column(Text)
    has_lease_violations = Column(Boolean, default=False)
    lease_violation_details = Column(Text)

    # Personal References
    personal_references = Column(JSON)
    emergency_contact_tenant = Column(JSON)

    # Pet Information
    has_pets = Column(Boolean, default=False)
    pet_details = Column(JSON)

    # Tenant Insurance
    tenant_insurance_provider = Column(String(100))
    tenant_insurance_policy_number = Column(String(100))
    tenant_insurance_expiry = Column(Date)
    tenant_insurance_document = Column(String(255))

    # Application & Verification Status
    tenant_verification_status = Column(String(20), default="not_started")
    tenant_verification_score = Column(Integer)
    tenant_verification_submitted_at = Column(DateTime)
    tenant_verification_reviewed_at = Column(DateTime)
    tenant_verification_reviewed_by = Column(String(36))
    tenant_verification_notes = Column(Text)

    # Preferences & Requirements
    desired_move_in_date = Column(Date)
    lease_duration_preference = Column(String(50))
    budget_range_min = Column(Numeric(15, 2))
    budget_range_max = Column(Numeric(15, 2))
    preferred_locations = Column(JSON)
    property_type_preferences = Column(JSON)

    # Consent & Agreements
    background_check_consent = Column(Boolean, default=False)
    credit_check_consent = Column(Boolean, default=False)
    data_processing_consent = Column(Boolean, default=False)
    terms_accepted = Column(Boolean, default=False)

    failed_login_attempts = Column(Integer, default=0)
    last_failed_login = Column(DateTime)
    last_successful_login = Column(DateTime)

    verification_token = Column(Text)
    verification_code = Column(String(6))

    # Onboarding Fields
    is_landlord_onboarded = Column(Boolean, default=False)
    landlord_onboarding_step = Column(Integer, default=1)
    landlord_verification_status = Column(String(20), default="not_started")

    is_tenant_onboarded = Column(Boolean, default=False)
    tenant_onboarding_step = Column(Integer, default=1)

    # Status Fields
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

    def add_identity_document(self, doc_type, url, verified=False):
        """Add an identity document"""
        if not self.identity_documents:
            self.identity_documents = []

        self.identity_documents.append(
            {
                "type": doc_type,
                "url": url,
                "verified": verified,
                "uploaded_at": datetime.datetime.utcnow().isoformat(),
            }
        )

    def get_identity_document(self, doc_type):
        """Get a specific identity document"""
        if not self.identity_documents:
            return None

        for doc in self.identity_documents:
            if doc.get("type") == doc_type:
                return doc
        return None

    def has_verified_identity(self):
        """Check if user has at least one verified identity document"""
        if not self.identity_documents:
            return False

        return any(doc.get("verified", False) for doc in self.identity_documents)

    def can_list_property(self):
        """Check if landlord can list properties"""
        return (
            self.role == "landlord"
            and self.is_landlord_onboarded
            and self.landlord_verification_status == "approved"
            and self.is_email_verified
            and self.has_verified_identity()  # Added identity verification check
        )

    def get_missing_verification_docs(self):
        """Get list of missing required documents for landlords"""
        required_docs = []

        # Identity documents
        if not self.has_verified_identity():
            required_docs.append("Verified Identity Document")

        # Property ownership
        if not self.deed_or_title_document:
            required_docs.append("Property Deed/Title")
        if not self.property_tax_receipt:
            required_docs.append("Property Tax Receipt")

        # Financial documents
        if not self.bank_verification_document:
            required_docs.append("Bank Verification")
        if not self.tax_document:
            required_docs.append("Tax Document")

        return required_docs

    def can_apply_for_property(self, property_rent):
        """Check if tenant meets basic requirements for a property"""
        # Income requirement (3x monthly rent)
        income_requirement = property_rent * 3
        has_sufficient_income = self.total_monthly_income >= income_requirement

        # Basic verification checks
        is_verified = (
            self.is_tenant_onboarded
            and self.tenant_verification_status == "approved"
            and self.is_email_verified
            and self.has_verified_identity()  # Added identity verification
        )

        return has_sufficient_income and is_verified

    def get_missing_tenant_docs(self):
        """Get list of missing tenant verification documents"""
        required_docs = []

        if not self.has_verified_identity():
            required_docs.append("Verified Government ID")
        if not self.employment_start_date:
            required_docs.append("Employment Information")
        if not self.total_monthly_income:
            required_docs.append("Income Verification")
        if not self.background_check_consent:
            required_docs.append("Background Check Consent")

        return required_docs

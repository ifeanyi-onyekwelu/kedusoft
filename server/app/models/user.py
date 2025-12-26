from sqlalchemy import (
    Column,
    String,
    Date,
    Boolean,
    DateTime,
    Text,
    Integer,
    Numeric,
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

    # Authentication & Verification
    failed_login_attempts = Column(Integer, default=0)
    last_failed_login = Column(DateTime)
    last_successful_login = Column(DateTime)
    verification_token = Column(Text)
    verification_code = Column(String(6))

    # Status Fields
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    is_suspended = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships to separate tables
    identity_documents = relationship(
        "UserIdentityDocument",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="select",
    )

    bank_details = relationship(
        "UserBankDetails",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="select",
    )

    insurance = relationship(
        "UserInsurance",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="select",
    )

    landlord_info = relationship(
        "LandlordInfo",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="select",
    )

    tenant_info = relationship(
        "TenantInfo",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="select",
    )

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
        from .user_documents import UserIdentityDocument

        doc = UserIdentityDocument(
            user_id=self.id,
            document_type=doc_type,
            document_url=url,
            is_verified=verified,
        )
        self.identity_documents.append(doc)
        return doc

    def get_identity_document(self, doc_type):
        """Get a specific identity document"""
        for doc in self.identity_documents:
            if doc.document_type == doc_type:
                return doc
        return None

    def has_verified_identity(self):
        """Check if user has at least one verified identity document"""
        return any(doc.is_verified for doc in self.identity_documents)

    def can_list_property(self):
        """Check if landlord can list properties"""
        if not self.landlord_info:
            return False

        return (
            self.role == "landlord"
            and self.is_email_verified
            and self.has_verified_identity()
            and self.landlord_info.verification_status == "approved"
        )

    def get_missing_verification_docs(self):
        """Get list of missing required documents for landlords"""
        required_docs = []

        if not self.landlord_info:
            required_docs.append("Landlord Profile Setup Required")
            return required_docs

        # Identity documents
        if not self.has_verified_identity():
            required_docs.append("Verified Identity Document")

        # Property ownership
        if not self.landlord_info.deed_or_title_document:
            required_docs.append("Property Deed/Title")
        if not self.landlord_info.property_tax_receipt:
            required_docs.append("Property Tax Receipt")

        # Financial documents
        if not self.bank_details or not self.bank_details.is_verified:
            required_docs.append("Bank Verification")
        if not self.landlord_info.tax_document:
            required_docs.append("Tax Document")

        return required_docs

    def can_apply_for_property(self, property_rent):
        """Check if tenant meets basic requirements for a property"""
        if not self.tenant_info:
            return False

        # Income requirement (3x monthly rent)
        income_requirement = property_rent * 3
        has_sufficient_income = (
            self.tenant_info.total_monthly_income
            and self.tenant_info.total_monthly_income >= income_requirement
        )

        # Basic verification checks
        is_verified = (
            self.is_email_verified
            and self.tenant_info.verification_status == "approved"
            and self.has_verified_identity()
        )

        return has_sufficient_income and is_verified

    def get_missing_tenant_docs(self):
        """Get list of missing tenant verification documents"""
        required_docs = []

        if not self.tenant_info:
            required_docs.append("Tenant Profile Setup Required")
            return required_docs

        if not self.has_verified_identity():
            required_docs.append("Verified Government ID")
        if not self.tenant_info.employment_start_date:
            required_docs.append("Employment Information")
        if not self.tenant_info.total_monthly_income:
            required_docs.append("Income Verification")
        if not self.tenant_info.background_check_consent:
            required_docs.append("Background Check Consent")

        return required_docs

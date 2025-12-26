"""User bank account information model"""

from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import datetime


class UserBankDetails(BaseModel):
    """Stores bank account information for landlords and tenants"""

    __tablename__ = "user_bank_details"

    id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(
        String(50), ForeignKey("users.id"), nullable=False, unique=True, index=True
    )

    bank_name = Column(String(100), nullable=False)
    account_holder_name = Column(String(100), nullable=False)
    account_number = Column(String(50), nullable=False)
    routing_number = Column(String(50))
    swift_code = Column(String(50))
    iban = Column(String(100))  # For international transfers

    account_type = Column(String(50))  # checking, savings
    currency = Column(String(3), default="USD")

    is_verified = Column(Boolean, default=False)
    verification_document_url = Column(String(255))
    verified_at = Column(DateTime)
    verified_by = Column(String(50))

    is_primary = Column(Boolean, default=True)  # For multiple accounts

    notes = Column(Text)

    # Relationships
    user = relationship("User", back_populates="bank_details")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

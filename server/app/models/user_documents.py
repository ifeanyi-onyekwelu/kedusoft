"""User identity and verification documents model"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import datetime


class UserIdentityDocument(BaseModel):
    """Stores identity documents for users (national ID, passport, driver's license, etc.)"""

    __tablename__ = "user_identity_documents"

    id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)

    document_type = Column(
        String(50), nullable=False
    )  # national_id, passport, driver_license
    document_url = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime)
    verified_by = Column(String(50))

    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)  # For documents with expiry

    notes = Column(Text)  # Admin notes
    rejection_reason = Column(Text)  # If rejected

    # Relationships
    user = relationship("User", back_populates="identity_documents")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

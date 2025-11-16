from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
import datetime
from . import BaseModel
from .db_utils import generate_id


class Document(BaseModel):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_id)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    document_type = Column(
        String(100), nullable=False
    )  # e.g., 'identity_card', 'proof_of_income', 'employment_letter', 'bank_statement'
    document_name = Column(String(255), nullable=False)  # Original filename
    file_path = Column(String(500), nullable=False)  # Path to stored file
    file_size = Column(Integer)  # File size in bytes
    mime_type = Column(String(100))  # e.g., 'application/pdf', 'image/jpeg'
    description = Column(Text)  # Optional description
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    verified = Column(String(20), default="pending")  # pending, approved, rejected
    verified_at = Column(DateTime)
    verified_by = Column(
        String(36), ForeignKey("users.id")
    )  # Admin/landlord who verified

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="documents")
    verified_by_user = relationship("User", foreign_keys=[verified_by])

    def __repr__(self):
        return f"<Document {self.document_type} for user {self.user_id}>"

from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Date,
    Text,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
from datetime import datetime


class Lease(BaseModel):
    __tablename__ = "leases"

    id = Column(String(50), primary_key=True, default=generate_id)
    property_id = Column(String(50), ForeignKey("properties.id"), nullable=False)
    tenant_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    landlord_id = Column(String(50), ForeignKey("users.id"), nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    monthly_rent = Column(Integer, nullable=False)
    security_deposit = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    terms = Column(Text)

    # Signature fields
    tenant_signed_at = Column(DateTime)
    tenant_signature = Column(Text)  # Could be a text signature or reference to file
    landlord_signed_at = Column(DateTime)
    landlord_signature = Column(Text)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    # Relationships
    property = relationship(
        "Property",
        back_populates="leases",
        foreign_keys=[property_id],
    )
    tenant = relationship(
        "User",
        back_populates="tenant_leases",
        foreign_keys=[tenant_id],
    )
    landlord = relationship(
        "User",
        back_populates="landlord_leases",
        foreign_keys=[landlord_id],
    )

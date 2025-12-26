"""User insurance information model"""

from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import datetime


class UserInsurance(BaseModel):
    """Stores insurance information for landlords and tenants"""

    __tablename__ = "user_insurance"

    id = Column(String(50), primary_key=True, default=generate_id)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)

    insurance_type = Column(String(50), nullable=False)  # landlord, tenant
    provider_name = Column(String(100), nullable=False)
    policy_number = Column(String(100), nullable=False)
    policy_url = Column(String(255))

    coverage_amount = Column(String(50))
    start_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)

    is_active = Column(String(20), default="active")  # active, expired, cancelled

    notes = Column(Text)

    # Relationships
    user = relationship("User", back_populates="insurance")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

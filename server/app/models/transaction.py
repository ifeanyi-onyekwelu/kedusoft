from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Enum
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import enum


class PaymentPurpose(enum.Enum):
    SCREENING = "screening"
    RENT = "rent"
    OTHER = "other"


class Transaction(BaseModel):
    __tablename__ = "transactions"

    id = Column(String(20), primary_key=True, default=generate_id)
    tenant_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    property_id = Column(String(20), ForeignKey("properties.id"), nullable=False)
    payment_id = Column(String(20), ForeignKey("payments.id"), nullable=False)
    amount = Column(Numeric(10, 2))
    payment_status = Column(String(50), default="unpaid")
    payment_purpose = Column(
        Enum(PaymentPurpose),
        nullable=False,
    )
    transaction_date = Column(DateTime, default=datetime.datetime.now)

    tenant = relationship("User", backref="transactions")
    property = relationship("Property", backref="transactions")
    payment = relationship("Payment", backref="transactions")

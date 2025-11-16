from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
import datetime
import uuid
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class Payment(BaseModel):
    __tablename__ = "payments"

    id = Column(String(20), primary_key=True, default=generate_id)
    screening_id = Column(String(20), ForeignKey("screenings.id"), nullable=False)
    amount = Column(Numeric(10, 2))
    payment_status = Column(String(50), default="pending")
    payment_date = Column(DateTime, default=datetime.datetime.now)

    screening = relationship("Screening", backref="payments")

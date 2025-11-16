from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id


class SearchHistory(BaseModel):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    search_query = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", backref="search_history")

from sqlalchemy import Column, String
from . import BaseModel
from .db_utils import generate_id


class Category(BaseModel):
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True, default=generate_id)
    name = Column(String(100), nullable=False, unique=True)

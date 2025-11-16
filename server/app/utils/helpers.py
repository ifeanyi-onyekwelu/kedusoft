from flask import g
from flask_jwt_extended import (
    get_jwt_identity,
    create_refresh_token,
    create_access_token,
    get_jwt,
)
from datetime import timedelta
from ..models.db_utils import get_item_by_id, create_item
from ..models import User
from ..models.category import Category


def response(msg: str, data=None, success=True):
    return {"message": msg, "data": data, "success": success}


def get_logged_in_user():
    user_id = get_jwt_identity()
    # Get role from JWT claims
    role = get_jwt().get("role")

    user = get_item_by_id(g.session, User, user_id)  # Convert to int if needed
    return user.id, user.to_dict(), role


def generate_tokens(user):
    accessToken = create_access_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=1),
        fresh=True,
    )
    refreshToken = create_refresh_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(days=7),
    )
    return accessToken, refreshToken


def map_func(seq, func):
    """Emulates Javascript's map array method"""
    res = []
    for index, item in enumerate(seq):
        res.append(func(item, index, seq))
    return res


def filter_func(seq, func):
    """Emulates Javascript's filter array method"""
    res = []
    for index, item in enumerate(seq):
        if func(item, index, seq):
            res.append(item)
    return res


def dict_except(obj, *unused):
    new_obj = {**obj}
    for key in obj.keys():
        if key in unused:
            del new_obj[key]
    return new_obj


def serialize(item_list):
    if isinstance(item_list, list):
        return [item.to_dict() for item in item_list]
    elif item_list is not None:
        return item_list.to_dict()
    else:
        return None


def seed_categories(session):
    categories = [
        {"name": "Apartment"},
        {"name": "Duplex"},
        {"name": "Bungalow"},
        {"name": "Office"},
    ]
    for cat in categories:
        exists = session.query(Category).filter_by(name=cat["name"]).first()
        if not exists:
            create_item(session, Category, cat)
    session.commit()

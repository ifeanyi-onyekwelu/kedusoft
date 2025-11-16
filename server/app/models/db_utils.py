from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import NoResultFound
import uuid
from sqlalchemy import desc


def generate_id():
    return str(uuid.uuid4())


def get_item_by_id(session: Session, model, item_id):
    """
    Fetches a single item by its ID.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :param item_id: ID of the item to fetch.
    :return: The item if found, else None.
    """
    try:
        return session.query(model).filter_by(id=item_id).one()
    except NoResultFound:
        return None


def get_all_items(session: Session, model):
    """
    Fetches all items of a given model.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :return: List of all items.
    """
    return session.query(model).all()


def create_item(session: Session, model, data):
    """
    Adds a new item to the database.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :param kwargs: Fields to initialize the model instance.
    :return: The created item.
    """
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary.")

    item = model(**data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update_item(session: Session, model, item_id, data):
    """
    Updates an existing item by its ID.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :param item_id: ID of the item to update.
    :param data: Dictionary containing fields to update.
    :return: The updated item or None if not found.
    """

    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary.")

    item = session.query(model).filter_by(id=item_id).first()
    if not item:
        return None

    for key, value in data.items():
        setattr(item, key, value)  # Update fields dynamically
    session.commit()
    session.refresh(item)
    return item


def delete_item(session: Session, model, item_id):
    """
    Deletes an item by its ID.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :param item_id: ID of the item to delete.
    :return: True if the item was deleted, False otherwise.
    """
    item = get_item_by_id(session, model, item_id)
    if not item:
        return False
    session.delete(item)
    session.commit()
    return True


def get_item_by_filter(session: Session, model, filters):
    """
    Fetches a single item that matches the given filter criteria.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :param filters: Dictionary of filter criteria as key-value pairs.
    :return: The item if found, else None.
    """
    if not isinstance(filters, dict):
        raise ValueError("Filters must be a dictionary.")

    return session.query(model).filter_by(**filters).first()


def get_items_by_filter(
    session: Session,
    model,
    filters=None,
    complex_filters=None,
    order_by=None,
    limit=None,
):
    """
    Fetches items that match the given filter criteria with optional sorting and limiting.

    :param session: SQLAlchemy session object
    :param model: ORM model class
    :param filters: Dictionary of filter criteria (default: None)
    :param order_by: String of column to order by with optional .desc() (default: None)
    :param limit: Maximum number of items to return (default: None)
    :return: List of items matching the criteria
    """
    query = session.query(model)

    # Apply filters if provided
    if filters:
        if not isinstance(filters, dict):
            raise ValueError("Filters must be a dictionary.")
        query = query.filter_by(**filters)

    if complex_filters:
        query = query.filter(*complex_filters)

    # Apply ordering if specified
    if order_by:
        if order_by.endswith(".desc()"):
            column_name = order_by.replace(".desc()", "")
            column = getattr(model, column_name, None)
            if column is not None:
                query = query.order_by(desc(column))
        else:
            column = getattr(model, order_by, None)
            if column is not None:
                query = query.order_by(column)

    # Apply limit if specified
    if limit:
        query = query.limit(limit)

    return query.all()


def get_item_with_relationships(session: Session, model, filters, relationships=None):
    """
    Fetches a single item with eager-loaded relationships
    :param session: SQLAlchemy session
    :param model: ORM model class
    :param filters: Dictionary of filter criteria
    :param relationships: List of relationship attributes to eager load
    :return: The item if found, else None
    """
    if not isinstance(filters, dict):
        raise ValueError("Filters must be a dictionary.")

    query = session.query(model)

    if relationships:
        for rel in relationships:
            query = query.options(joinedload(rel))

    return query.filter_by(**filters).first()


def count_items(session: Session, model):
    """
    Counts the number of items in a model.
    :param session: SQLAlchemy session object.
    :param model: ORM model class.
    :return: Count of items.
    """
    return session.query(model).count()


from sqlalchemy.orm import Query
from typing import Tuple


def get_paginated_items(
    session: Session,
    model,
    filters: dict = None,
    page: int = 1,
    per_page: int = 10,
    order_by=None,
) -> Tuple[list, int, int]:
    """
    Fetches paginated items with optional filtering and ordering.

    :param session: SQLAlchemy session object
    :param model: ORM model class
    :param filters: Dictionary of filter criteria (default: None)
    :param page: Current page number (default: 1)
    :param per_page: Number of items per page (default: 10)
    :param order_by: Column to order by (default: None)
    :return: Tuple of (items, total_items, total_pages)
    """
    # Create base query
    query = session.query(model)

    # Apply filters if provided
    if filters and isinstance(filters, dict):
        query = query.filter_by(**filters)

    # Apply ordering if specified
    if order_by is not None:
        query = query.order_by(order_by)

    # Calculate offset
    offset = (page - 1) * per_page

    # Get total count before pagination
    total_items = query.count()

    # Apply pagination
    items = query.offset(offset).limit(per_page).all()

    # Calculate total pages
    total_pages = (total_items + per_page - 1) // per_page

    return {
        "items": items,
        "total": total_items,
        "pages": total_pages,
        "current_page": page,
        "per_page": per_page,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }

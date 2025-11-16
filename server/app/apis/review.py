from flask import Blueprint, request
from ..utils.helpers import response

review = Blueprint("review", __name__)


@review.post("/review")
def submit_review():
    review = request.json


@review.get("/average_ratings/<product_id>")
def average_rating(product_id):
    return response("No reviews available for this product.")

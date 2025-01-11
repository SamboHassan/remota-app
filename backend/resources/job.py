from flask import request, jsonify
from flask_login import current_user, login_required, LoginManager
from marshmallow import ValidationError

from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_jwt,
    jwt_required,
    get_jwt_identity,
)
from sqlalchemy.exc import SQLAlchemyError

from db import db
from app import login_manager
from models import JobModel, UserModel
from schemas import JobSchema, JobPlainSchema

blp = Blueprint("Jobs", "jobs", description="Operations on jobs")


# product_bp = Blueprint("product", __name__, url_prefix="/products")
@login_manager.user_loader
def load_user(user_id):
    return UserModel.query.get(int(user_id))


@blp.route("/jobs", methods=["POST"])
@blp.arguments(JobSchema)  # Validate request payload with schema
@blp.response(201, JobSchema)  # Validate response with schema
@login_required
@jwt_required()
def create_job(job_data):
    current_user_id = get_jwt_identity()
    print(current_user_id)
    try:
        # Check if the user is authenticated and an admin
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        # Extract required fields
        title = job_data.get("title")
        description = job_data.get("description")
        location = job_data.get("location", "Remote")  # Default to "Remote"

        if not title or not description:
            return {"message": "Both title and description are required."}, 400

        # Create a new job instance
        new_job = JobModel(
            title=title,
            description=description,
            location=location,
            posted_by=current_user.id,
        )

        # Add and commit the job to the database
        db.session.add(new_job)
        db.session.commit()

        return new_job, 201

    except ValidationError as ve:
        db.session.rollback()  # Rollback transaction on failure
        return {"message": ve.messages}, 400

    except Exception as e:
        db.session.rollback()
        return {"message": f"An unexpected error occurred: {str(e)}"}, 500

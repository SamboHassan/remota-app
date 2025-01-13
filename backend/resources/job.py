from flask import request, jsonify
from flask_login import current_user, login_required, login_manager
from marshmallow import ValidationError

from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    get_jwt_identity,
    get_jwt,
    jwt_required,
    get_jwt_identity,
)
from sqlalchemy.exc import SQLAlchemyError

from db import db

from models import JobModel, UserModel, ApplicationModel
from schemas import JobSchema, JobPlainSchema

blp = Blueprint("Jobs", "jobs", description="Operations on jobs")

# --------------------- 1. Create or Post a Job


@blp.route("/jobs", methods=["POST"])
@blp.arguments(JobSchema)  # Validate request payload with schema
# @blp.response(201, JobSchema)  # Validate response with schema
@login_required  # Ensures the user is logged in via Flask-Login
@jwt_required()  # Ensures a valid JWT token is provided
def create_job(job_data):
    try:
        current_user_id = get_jwt_identity()
        print(current_user_id)
        # Check if the user is authenticated and an admin
        # if not current_user.is_authenticated or not current_user.is_admin:
        #     return jsonify({"message": "Unauthorized"}), 403

        if not current_user.is_admin:
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

        return {"message": "New job added successfully."}, 201

    except ValidationError as ve:
        db.session.rollback()  # Rollback transaction on failure
        return {"message": ve.messages}, 400

    except Exception as e:
        db.session.rollback()
        return {"message": f"An unexpected error occurred: {str(e)}"}, 500


# --------------------- 2. Get all Jobs


@blp.route("/jobs", methods=["GET"])
@blp.response(201, JobSchema)  # Validate response with schema
def get_jobs():
    try:
        jobs = JobModel.query.all()
        jobs_list = [
            {
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "posted_at": job.posted_at,
                "posted_by": job.posted_by,
            }
            for job in jobs
        ]
        return jsonify(jobs_list), 200
    except ValidationError as ve:
        return {"message": ve.messages}, 400

    except Exception as e:
        return {"message": f"An unexpected error occurred: {str(e)}"}, 500


# --------------------- 3. Apply for a Job


@blp.route("/jobs/<int:job_id>/apply", methods=["POST"])
def apply_for_job(job_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "Unauthorized"}), 403

    job = JobModel.query.get_or_404(job_id)
    # Check if user has already applied
    existing_application = ApplicationModel.query.filter_by(
        job_id=job.id, applicant_id=current_user.id
    ).first()
    if existing_application:
        return jsonify({"message": "You have already applied for this job."}), 400

    application = ApplicationModel(job_id=job.id, applicant_id=current_user.id)
    db.session.add(application)
    db.session.commit()

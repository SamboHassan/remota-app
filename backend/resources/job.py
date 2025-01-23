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
from schemas import JobSchema, UpdateJobSchema, ApplyJobSchema

blp = Blueprint("Jobs", "jobs", description="Operations on jobs")

# --------------------- 1. Create or Post a Job


@blp.route("/jobs", methods=["POST"])
@blp.arguments(JobSchema)  # Validate request payload with schema
# @blp.response(201, JobSchema)  # Validate response with schema
@login_required  # Ensures the user is logged in via Flask-Login
@jwt_required()  # Ensures a valid JWT token is provided
def create_job(job_data):
    try:
        # current_user_id = get_jwt_identity()
        # print(current_user_id)
        # Check if the user is authenticated and an admin
        # if not current_user.is_authenticated or not current_user.is_admin:
        #     return jsonify({"message": "Unauthorized"}), 403

        if not current_user.is_authenticated and not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        # Extract required fields
        title = job_data.get("title")
        company = job_data.get("company")
        description = job_data.get("description")
        location = job_data.get("location", "Remote")  # Default to "Remote"

        if not title or not description:
            return {"message": "Both title and description are required."}, 400

        # Create a new job instance
        new_job = JobModel(
            title=title,
            company=company,
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
                "company": job.company,
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
@blp.arguments(ApplyJobSchema)  # Validates request body
@login_required  # Ensures the user is logged in
@jwt_required()  # Ensures a valid JWT token is provided
def apply_for_job(user_data, job_id):
    print(f"Received user data: {user_data}")  # Debug log

    try:
        # 'data' comes from @blp.arguments,
        # 'job_id' comes from URL
        # Check user authentication
        if not current_user.is_authenticated:
            return jsonify({"message": "Unauthorized"}), 403

        # Check if job exists
        job = JobModel.query.get_or_404(job_id)

        # Check if the user has already applied for the job
        existing_application = ApplicationModel.query.filter_by(
            job_id=job.id, applicant_id=current_user.id
        ).first()
        if existing_application:
            return jsonify({"message": "You have already applied for this job."}), 400

        # Process application
        application = ApplicationModel(
            job_id=job.id,
            applicant_id=current_user.id,
            resume_url=user_data.get("resume_url"),
            cover_letter=user_data.get("cover_letter"),
        )
        db.session.add(application)
        db.session.commit()

        return (
            jsonify({"message": f"Application for job '{job.title}' submitted!"}),
            201,
        )
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# ------- 6. Updating Job Details (Admin Only)


@blp.route("/jobs/<int:job_id>", methods=["PUT"])
@blp.arguments(UpdateJobSchema)  # Validates request body
@login_required  # Ensures the user is logged in
@jwt_required()  # Ensures a valid JWT token is provided
def update_job(job_data, job_id):
    try:
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        job = JobModel.query.get_or_404(job_id)
        job.title = job_data["title"]
        job.description = job_data["description"]
        db.session.commit()

        return jsonify({"message": f"Job '{job.title}' updated successfully!"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@blp.route("/jobs/<int:job_id>", methods=["DELETE"])
# @blp.arguments(UpdateJobSchema)  # Validates request body
@login_required  # Ensures the user is logged in
@jwt_required()  # Ensures a valid JWT token is provide
def delete_job(job_id):
    try:
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        job = JobModel.query.get_or_404(job_id)
        db.session.delete(job)
        db.session.commit()

        return jsonify({"message": f"Job '{job.title}' deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# ------------------------ 9. Querying Applications for a Specific Job (Admin Only)
# @app.route("/jobs/<int:job_id>/applications", methods=["GET"])
# def get_job_applications(job_id):
#     if not current_user.is_authenticated or not current_user.is_admin:
#         return jsonify({"message": "Unauthorized"}), 403

#     job = Job.query.get_or_404(job_id)
#     applications = JobApplication.query.filter_by(job_id=job.id).all()
#     applications_list = [
#         {
#             "id": application.id,
#             "applicant_id": application.applicant_id,
#             "applicant_username": application.applicant.username,
#             "status": application.status,
#             "application_date": application.application_date,
#         }
#         for application in applications
#     ]
#     return jsonify(applications_list), 200


# ---------------- 7. Querying Jobs (Search by Keyword)
# @app.route("/jobs/search", methods=["GET"])
# def search_jobs():
#     keyword = request.args.get("keyword", "")
#     jobs = Job.query.filter(
#         Job.title.contains(keyword) | Job.description.contains(keyword)
#     ).all()
#     jobs_list = [
#         {
#             "id": job.id,
#             "title": job.title,
#             "description": job.description,
#             "date_posted": job.date_posted,
#         }
#         for job in jobs
#     ]
#     return jsonify(jobs_list), 200

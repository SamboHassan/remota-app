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
from schemas import (
    JobSchema,
    UpdateJobSchema,
    ApplyJobSchema,
    ApplicationSchema,
    JobSearchSchema,
    ApplicationStatusSchema,
)

blp = Blueprint("Jobs", "jobs", description="Operations on jobs")

# --------------------- 1. Create or Post a Job


@blp.route("/api/jobs", methods=["POST"])
@blp.arguments(JobSchema)  # Validate request payload with schema
# @blp.response(201, JobSchema)  # Validate response with schema
@login_required  # Ensures the user is logged in via Flask-Login
@jwt_required()  # Ensures a valid JWT token is provided
def create_job(job_data):
    try:
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


@blp.route("/api/jobs", methods=["GET"])
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


@blp.route("/api/jobs/<int:job_id>/apply", methods=["POST"])
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


@blp.route("/api/jobs/<int:job_id>", methods=["PATCH"])
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


@blp.route("/api/jobs/<int:job_id>", methods=["DELETE"])
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


# ------- 9. Querying Applications for a Specific Job (Admin Only)


@blp.route("/api/jobs/<int:job_id>/applications", methods=["GET"])
@blp.response(200, ApplicationSchema(many=True))  # Validate response with schema
@login_required  # Ensures the user is logged in
@jwt_required()  # Ensures a valid JWT token is provided
def get_job_applications(job_id):
    try:

        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        job = JobModel.query.get_or_404(job_id)
        applications = ApplicationModel.query.filter_by(job_id=job.id).all()
        applications_list = [
            {
                "id": application.id,
                "applicant_id": application.applicant_id,
                "job_id": application.job_id,
                "resume_url": application.resume_url,
                "cover_letter": application.cover_letter,
                "applied_at": application.applied_at,
                "status": application.status,
            }
            for application in applications
        ]
        # return jsonify(applications_list), 200
        return applications_list, 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# ---------------- 7. Querying Jobs (Search by Keyword)


@blp.route("/api/jobs/<string:keyword>", methods=["GET"])
@blp.response(200, JobSearchSchema(many=True))
def search_jobs(keyword):
    try:
        jobs = JobModel.query.filter(
            JobModel.title.contains(keyword) | JobModel.description.contains(keyword)
        ).all()
        jobs_list = [
            {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "posted_at": job.posted_at,
            }
            for job in jobs
        ]
        return jobs_list, 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@blp.route("/api/applications/<int:application_id>", methods=["PATCH"])
@blp.arguments(ApplicationStatusSchema)
@login_required  # Ensures the user is logged in
@jwt_required()  # Ensures a valid JWT token is provided
def update_application_status(status_data, application_id):
    try:
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403

        application = ApplicationModel.query.get_or_404(application_id)

        application.status = status_data["status"]
        db.session.commit()

        return (
            jsonify(
                {"message": f"Application status updated to '{application.status}'!"}
            ),
            200,
        )

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

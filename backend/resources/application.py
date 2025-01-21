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

from models import JobModel, UserModel
from schemas import JobSchema, JobPlainSchema

# blp = Blueprint(
#     "Applications", "applications", description="Operations on applications"
# )


# 5. Displaying Job Applications (Admin Only)
# @app.route('/applications', methods=['GET'])
# def get_applications():
#     if not current_user.is_authenticated or not current_user.is_admin:
#         return jsonify({"message": "Unauthorized"}), 403

#     applications = JobApplication.query.all()
#     applications_list = [
#         {
#             "id": application.id,
#             "job_id": application.job_id,
#             "job_title": application.job.title,
#             "applicant_id": application.applicant_id,
#             "applicant_username": application.applicant.username,
#             "status": application.status,
#             "application_date": application.application_date,
#         }
#         for application in applications
#     ]
#     return jsonify(applications_list), 200


# --------------------  10. Updating Application Status (Admin Only)
# @app.route("/applications/<int:application_id>", methods=["PUT"])
# def update_application_status(application_id):
#     if not current_user.is_authenticated or not current_user.is_admin:
#         return jsonify({"message": "Unauthorized"}), 403

#     application = JobApplication.query.get_or_404(application_id)
#     data = request.json
#     application.status = data.get("status", application.status)
#     db.session.commit()

#     return (
#         jsonify({"message": f"Application status updated to '{application.status}'!"}),
#         200,
#     )


# Notes:
# Authentication & Authorization: Use Flask-Login to manage user authentication and role-based access (admin vs. job seeker).
# Error Handling: Include appropriate error handling (e.g., 404 for not found, 400 for bad input).
# Validation: Validate user input to ensure data integrity.
# Frontend: Integrate these APIs with a frontend framework like React or Angular for a complete web application.
# Would you like me to e

from datetime import datetime
import json

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_login import UserMixin

from db import db


# Application Model
class ApplicationModel(db.Model, UserMixin):
    __tablename__ = "applications"
    id = db.Column(db.Integer, primary_key=True)
    applicant_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    applied_at = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(
        db.String(50), default="Pending"
    )  # Application status: Pending, Accepted, Rejected

    def __repr__(self):
        return f"<ApplicantId: {self.applicant_id}, JobId: {self.job_id}"

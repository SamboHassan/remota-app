from db import db
from datetime import datetime
import json
from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash


class UserModel(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    is_admin = db.Column(db.Boolean, default=False)  # Admin flag
    jobs_posted = db.relationship("JobModel", backref="poster", lazy="dynamic")

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    def __repr__(self):
        return f"<User: {self.username}>"


class JobModel(db.Model, UserMixin):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(150), nullable=True)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False, default="Remote")
    posted_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    posted_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def format(self):
        return {"id": self.id, "title": self.title, "description": self.description}


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


applied_at = db.Column(db.DateTime, default=db.func.current_timestamp())
# Use Case: This approach is useful when you want the default value to
# be set by the application code rather than the database.

posted_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
posted_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
# Use Case: This approach is preferred when you want the database to handle the
# default value. It ensures that the default value is set consistently even if
# rows are inserted through other means

# The default=datetime.utcnow syntax is deprecated in SQLAlchemy when defining
# default values for columns. Instead, you should use the func module from SQLAlchemy.
# Here's the correct syntax:

# created_on = Column(DateTime, server_default=func.now())

from datetime import datetime
import json

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

from db import db


# Application Model
class ApplicationModel(db.Model):
    __tablename__ = "applications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    applied_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("UserModel", backref=db.backref("applications", lazy=True))
    job = db.relationship("JobModel", backref=db.backref("applications", lazy=True))

    def __repr__(self):
        return f"<UserID: {self.user_id}, JobID: {self.job_id}"

from datetime import datetime
import json

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from sqlalchemy.sql import func

from db import db


class JobModel(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False, default="Remote")
    posted_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    posted_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # posted_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    admin = db.relationship("UserModel", backref=db.backref("jobs_posted", lazy=True))

    def format(self):
        return {"id": self.id, "title": self.title, "description": self.description}

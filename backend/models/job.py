from db import db
from datetime import datetime
import json
from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash


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

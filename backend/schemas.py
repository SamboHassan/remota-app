from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int(dump_only=True)  # Read-only field, not required in input
    username = fields.Str(required=True)  # Required during creation
    password = fields.Str(
        required=True, load_only=True
    )  # Write-only field (not included in responses)
    email = fields.Email(required=True)  # Ensures a valid email format
    created_at = fields.DateTime(dump_only=True)  # Automatically set, read-only
    is_admin = fields.Bool(missing=False)  # Optional, defaults to False
    jobs_posted = fields.Nested("JobSchema", many=True)


# class UserSchema(Schema):
#     id = fields.Int(dump_only=True)  # Read-only field
#     username = fields.Str(required=True)  # Required
#     password = fields.Str(required=True, load_only=True)  # Write-only
#     email = fields.Email(required=True)  # Must be a valid email
#     created_at = fields.DateTime(dump_only=True)  # Auto-set, read-only
#     is_admin = fields.Bool(missing=False)  # Defaults to False
#     jobs_posted = fields.Nested("JobSchema", many=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)  # Only email is required
    password = fields.Str(required=True, load_only=True)  # Password is required


class JobSchema(Schema):
    id = fields.Integer(dump=True)
    title = fields.Str(required=True)
    company = fields.Str(required=True)
    description = fields.Str(required=True)
    location = fields.Str(default="Remote")
    posted_at = fields.DateTime(dump=True)
    posted_by = fields.Integer()  # Assuming user ID is an integer
    admin = fields.Nested(
        "UserSchema", exclude=("jobs_posted",), required=False
    )  # Exclude backref


class ApplyJobSchema(Schema):
    resume_url = fields.String(required=True)
    cover_letter = fields.String(required=True)


class UpdateJobSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(required=True)


# Here’s how you can create a Marshmallow schema for the ApplicationModel
# and an example route to return all applications with Marshmallow validation:

# from marshmallow import Schema, fields, validate
# from flask_marshmallow import Marshmallow

# # Initialize Marshmallow
# ma = Marshmallow()


# class ApplicationSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = ApplicationModel

#     id = ma.auto_field()
#     user_id = ma.auto_field()
#     job_id = ma.auto_field()
#     applied_at = ma.auto_field()

#     # Include nested data for user and job if needed
#     user = fields.Nested(lambda: UserSchema(only=("id", "username", "email")))
#     job = fields.Nested(lambda: JobSchema(only=("id", "title", "location")))


# # Schemas for related models
# class UserSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = UserModel

#     id = ma.auto_field()
#     username = ma.auto_field()
#     email = ma.auto_field()


# class JobSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = JobModel

#     id = ma.auto_field()
#     title = ma.auto_field()
#     location = ma.auto_field()


# Example Flask Route for Returning All Applications
# This route will fetch all applications and use the ApplicationSchema to
# serialize the data before returning it as JSON.


# from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy

# # Flask app and database initialization
# app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = (
#     "sqlite:///your_database.db"  # Replace with your database URI
# )
# db = SQLAlchemy(app)


# # Route to fetch all applications
# @app.route("/applications", methods=["GET"])
# def get_all_applications():
#     applications = ApplicationModel.query.all()
#     application_schema = ApplicationSchema(many=True)  # Serialize multiple records
#     return jsonify(application_schema.dump(applications)), 200


# if __name__ == "__main__":
#     app.run(debug=True)

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


class LoginSchema(Schema):
    email = fields.Email(required=True)  # Only email is required
    password = fields.Str(required=True, load_only=True)  # Password is required

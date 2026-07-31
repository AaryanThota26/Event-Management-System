"""
Auth Schemas
------------
Pydantic models for authentication requests and responses.

These schemas:
    - Validate incoming request bodies (signup, login)
    - Define the shape of API responses (token, user info)
    - Are used by Swagger UI to generate documentation
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


# ---------------------------------------------------------------------------
# Request Schemas (what the client sends)
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    """
    Schema for user registration (signup).

    Example body:
        {
            "full_name": "John Doe",
            "email": "john@example.com",
            "password": "securepass123",
            "role": "user"
        }
    """
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="User's full name",
        examples=["John Doe"],
    )
    email: EmailStr = Field(
        ...,
        description="Unique email address",
        examples=["john@example.com"],
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="Password (min 6 characters)",
        examples=["securepass123"],
    )
    role: Optional[UserRole] = Field(
        default=UserRole.USER,
        description="User role: user, organizer, or admin",
    )


class UserLogin(BaseModel):
    """
    Schema for user login.

    Example body:
        {
            "email": "john@example.com",
            "password": "securepass123"
        }
    """
    email: EmailStr = Field(
        ...,
        description="Registered email address",
        examples=["john@example.com"],
    )
    password: str = Field(
        ...,
        description="Account password",
        examples=["securepass123"],
    )


class ForgotPasswordRequest(BaseModel):
    """
    Schema for requesting a password reset email.

    Example body:
        {
            "email": "john@example.com"
        }
    """
    email: EmailStr = Field(
        ...,
        description="Email address to send the reset link to",
        examples=["john@example.com"],
    )


class ResetPasswordRequest(BaseModel):
    """
    Schema for resetting a password with a reset token.

    Example body:
        {
            "token": "PyQSBqcZt68rNtW6mKw11E7uQW0o3fMp3LN8o0UY3EI",
            "new_password": "newsecurepass123"
        }
    """
    token: str = Field(
        ...,
        min_length=8,
        max_length=512,
        description="Password reset token from the emailed link",
    )
    new_password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="New password (min 6 characters)",
        examples=["newsecurepass123"],
    )


# ---------------------------------------------------------------------------
# Response Schemas (what the API returns)
# ---------------------------------------------------------------------------

class TokenResponse(BaseModel):
    """
    Response returned after successful login.

    The frontend stores the access_token and sends it
    in the Authorization header for protected routes.
    """
    access_token: str = Field(
        ...,
        description="JWT access token",
    )
    token_type: str = Field(
        default="bearer",
        description="Token type (always 'bearer')",
    )
    user: "UserResponse"


class UserResponse(BaseModel):
    """
    Public user info returned in API responses.
    Never includes the password hash.
    """
    id: int
    full_name: str
    email: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    """Generic message response (e.g., success confirmation)."""
    message: str
    detail: Optional[str] = None


# Rebuild TokenResponse to resolve forward reference to UserResponse
TokenResponse.model_rebuild()

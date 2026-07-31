"""
Auth API Routes
----------------
Endpoints for user registration, login, and password reset.

Endpoints:
    POST /api/auth/signup          — Register a new user
    POST /api/auth/login           — Authenticate and receive a JWT token
    POST /api/auth/forgot-password — Email a password reset link
    GET  /api/auth/me              — Get current user profile (protected)
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.email_service import send_password_reset_email
from app.utils.security import (
    create_access_token,
    generate_reset_token,
    hash_password,
    hash_token,
    verify_password,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# POST /api/auth/signup — Register a new user
# ---------------------------------------------------------------------------

@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account. Email must be unique.",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Email already registered"},
    },
)
def signup(
    user_data: UserCreate,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Register a new user.

    - **full_name**: Your full name (2-100 characters)
    - **email**: Unique email address
    - **password**: Minimum 6 characters (will be hashed with bcrypt)
    - **role**: user, organizer, or admin (defaults to 'user')
    """
    # Check if email is already registered
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{user_data.email}' is already registered",
        )

    # Create new user with hashed password
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Refresh to get the generated ID and defaults

    return new_user


# ---------------------------------------------------------------------------
# POST /api/auth/login — Authenticate and get JWT token
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and get access token",
    description="Authenticate with email and password to receive a JWT token.",
    responses={
        200: {"description": "Login successful, JWT token returned"},
        401: {"description": "Invalid email or password"},
    },
)
def login(
    credentials: UserLogin,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Authenticate a user and return a JWT access token.

    - **email**: Your registered email
    - **password**: Your account password

    The returned `access_token` should be included in the
    Authorization header as: `Bearer <token>`
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()

    # Verify user exists and password is correct
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token with user ID and role
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
        }
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


# ---------------------------------------------------------------------------
# POST /api/auth/forgot-password — Request a password reset email
# ---------------------------------------------------------------------------

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request a password reset email",
    description=(
        "Generates a single-use reset token (stored as a SHA-256 hash), emails "
        "a reset link to the account, and always returns the same response "
        "whether or not the email exists, to prevent account enumeration."
    ),
    responses={
        200: {"description": "Reset link sent (or would have been sent)"},
        422: {"description": "Invalid email format"},
    },
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Request a password reset email.

    - **email**: The account email to send the reset link to

    Security properties:
        - Raw token is never stored — only its SHA-256 hash.
        - Token expires after RESET_TOKEN_EXPIRE_MINUTES (15 minutes).
        - A new request invalidates any previous token.
        - Identical response for existing and unknown emails; the unknown
          path runs a dummy bcrypt hash to equalize response timing.
    """
    user = db.query(User).filter(User.email == request.email).first()

    if user:
        token = generate_reset_token()
        user.reset_token = hash_token(token)
        user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(
            minutes=settings.RESET_TOKEN_EXPIRE_MINUTES
        )
        db.commit()

        reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={token}"
        send_password_reset_email(user.email, reset_url)
    else:
        # Timing equalization: bcrypt is deliberately slow (~100-300 ms),
        # masking whether the email matched an account.
        hash_password("timing-equalization-dummy")

    return MessageResponse(
        message="If an account exists for that email, a password reset link has been sent."
    )


# ---------------------------------------------------------------------------
# POST /api/auth/reset-password — Set a new password with a reset token
# ---------------------------------------------------------------------------

@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password with a token",
    description=(
        "Validates the emailed reset token (hashed before lookup, single-use, "
        "time-limited), then sets the new password. Returns a generic error "
        "for invalid or expired tokens."
    ),
    responses={
        200: {"description": "Password reset successfully"},
        400: {"description": "Invalid or expired reset token"},
        422: {"description": "Validation error"},
    },
)
def reset_password(
    request: ResetPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Reset a user's password.

    - **token**: The reset token from the emailed link
    - **new_password**: The new password (min 6 characters)

    Security properties:
        - The incoming token is SHA-256 hashed before the DB lookup, so the
          raw token is never compared or stored.
        - A valid token is invalidated immediately after use (single-use).
        - Expired or already-used tokens return the same generic 400 message;
          the API never reveals whether a token existed.
    """
    # Hash the incoming token before querying (never store/compare plaintext)
    token_hash = hash_token(request.token)

    user = (
        db.query(User)
        .filter(User.reset_token == token_hash)
        .first()
    )

    # Single generic failure for: unknown token, expired token,
    # already-used token (fields cleared), or expiry in the past.
    now = datetime.now(timezone.utc)
    if (
        user is None
        or user.reset_token_expiry is None
        or user.reset_token_expiry <= now
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Valid token: set the new password and invalidate the token (single-use)
    user.password = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return MessageResponse(
        message="Password has been reset successfully. You can now sign in with your new password."
    )


# ---------------------------------------------------------------------------
# GET /api/auth/me — Get current user profile (protected)
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Returns the authenticated user's profile. Requires a valid JWT token.",
    responses={
        200: {"description": "User profile returned"},
        401: {"description": "Not authenticated"},
    },
)
def get_profile(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Get the currently authenticated user's profile.

    Requires a valid JWT token in the Authorization header:
        `Bearer <token>`
    """
    return current_user

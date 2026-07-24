"""
Auth API Routes
----------------
Endpoints for user registration and login.

Endpoints:
    POST /api/auth/signup  — Register a new user
    POST /api/auth/login   — Authenticate and receive a JWT token
    GET  /api/auth/me      — Get current user profile (protected)
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.api.deps import get_current_user

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

"""
Security Utilities
------------------
Provides password hashing/verification and JWT token creation/verification.

Uses:
    - passlib with bcrypt for password hashing
    - python-jose for JWT tokens

These are standalone utility functions with no FastAPI dependency,
making them reusable in tests, scripts, and other contexts.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


# ---------------------------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------------------------

# CryptContext configures passlib to use bcrypt.
# bcrypt automatically handles salting — each hash is unique.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    Each call produces a different hash (different salt),
    even for the same input. This is by design.

    Args:
        plain_password: The raw password from the user.

    Returns:
        A bcrypt hash string (60 chars).

    Example:
        >>> hash_password("mypassword")
        '$2b$12$LJ3m4ys1K9...'
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hash.

    Args:
        plain_password: The raw password to check.
        hashed_password: The stored hash from the database.

    Returns:
        True if the password matches, False otherwise.

    Example:
        >>> verify_password("mypassword", "$2b$12$LJ3m4ys1K9...")
        True
        >>> verify_password("wrongpassword", "$2b$12$LJ3m4ys1K9...")
        False
    """
    return pwd_context.verify(plain_password, hashed_password)


# ---------------------------------------------------------------------------
# JWT Token Creation
# ---------------------------------------------------------------------------

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.

    The token encodes user identity (sub) and role so that
    protected routes can identify the user without a DB lookup
    on every request.

    Args:
        data: Payload to encode. Must contain "sub" (user ID as string)
              and optionally "role".
        expires_delta: Custom token lifetime. Defaults to
                       ACCESS_TOKEN_EXPIRE_MINUTES from config.

    Returns:
        Encoded JWT string.

    Example:
        >>> token = create_access_token({"sub": "1", "role": "organizer"})
        >>> len(token) > 0
        True
    """
    to_encode = data.copy()

    # Set expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),  # issued-at
    })

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT access token.

    Args:
        token: The JWT string to decode.

    Returns:
        The decoded payload dict if valid, None if expired or invalid.

    Example:
        >>> payload = decode_access_token(create_access_token({"sub": "1"}))
        >>> payload["sub"]
        '1'
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        return None

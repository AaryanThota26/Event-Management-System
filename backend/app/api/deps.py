"""
Auth Dependencies
-----------------
Reusable FastAPI dependencies for authentication and role-based access.

Usage in any route:

    from app.api.deps import get_current_user, require_role
    from app.models.user import User, UserRole

    # Require any authenticated user
    @router.get("/profile")
    def profile(user: User = Depends(get_current_user)):
        return user

    # Require a specific role
    @router.post("/events")
    def create_event(user: User = Depends(require_role(UserRole.ORGANIZER))):
        ...

    # Require one of multiple roles
    @router.get("/admin-panel")
    def admin_panel(user: User = Depends(require_role(UserRole.ADMIN, UserRole.ORGANIZER))):
        ...
"""

from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.utils.security import decode_access_token


# ---------------------------------------------------------------------------
# HTTP Bearer Scheme — tells Swagger to show the "Authorize" button
# Accepts only a JWT access token (no username/password fields)
# ---------------------------------------------------------------------------

security_scheme = HTTPBearer(
    description="Paste your JWT access token here (without 'Bearer' prefix)",
)


# ---------------------------------------------------------------------------
# Core Dependency: Extract User from Token
# ---------------------------------------------------------------------------

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """
    Dependency that extracts and validates the current user from a JWT token.

    Flow:
        1. FastAPI extracts the Bearer token from the Authorization header
        2. We decode the token and get the user ID
        3. We look up the user in the database
        4. Return the User object (or raise 401)

    This dependency is injected into any route that requires authentication.

    Raises:
        401 Unauthorized — if token is missing, expired, or invalid
        401 Unauthorized — if user ID from token doesn't exist in DB
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode the token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    # Extract user ID from the "sub" claim
    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    # Look up user in database
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


# ---------------------------------------------------------------------------
# Role-Based Access Dependency Factory
# ---------------------------------------------------------------------------

def require_role(*allowed_roles: UserRole):
    """
    Factory that returns a dependency restricting access to specific roles.

    Args:
        *allowed_roles: One or more UserRole values that are permitted.

    Returns:
        A dependency function suitable for use with Depends().

    Usage:
        # Only organizers can create events
        @router.post("/events")
        def create_event(
            user: User = Depends(require_role(UserRole.ORGANIZER))
        ):
            ...

        # Admins and organizers can access
        @router.get("/manage")
        def manage(
            user: User = Depends(require_role(UserRole.ADMIN, UserRole.ORGANIZER))
        ):
            ...
    """

    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in allowed_roles:
            role_names = " or ".join(r.value for r in allowed_roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied. Required role: {role_names}. "
                    f"Your role: {current_user.role.value}"
                ),
            )
        return current_user

    return role_checker

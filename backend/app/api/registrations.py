"""
Registration API Routes
-----------------------
Endpoints for viewing the current user's registrations.

Endpoints:
    GET /api/registrations/my  — View all events I registered for

Event-specific registration actions (register, cancel, participants)
are in the Events router under /api/events/{event_id}/...
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.registration import RegistrationDetailResponse
from app.services import registration_service as svc

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /api/registrations/my — My Registrations
# ---------------------------------------------------------------------------

@router.get(
    "/my",
    response_model=list[RegistrationDetailResponse],
    summary="My event registrations",
    description=(
        "Returns all events the authenticated user has registered for. "
        "Requires a valid JWT token."
    ),
)
def get_my_registrations(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
):
    registrations, _total = svc.get_my_registrations(db, user, skip=skip, limit=limit)
    return registrations

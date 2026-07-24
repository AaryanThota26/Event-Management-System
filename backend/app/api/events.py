"""
Event API Routes
----------------
Endpoints for event CRUD and admin approval.

All routes use existing auth dependencies from app.api.deps.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.api.deps import get_current_user, require_role
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventDetailResponse,
    EventListResponse,
)
from app.schemas.auth import MessageResponse
from app.services import event_service as svc

router = APIRouter()


# ---------------------------------------------------------------------------
# POST /api/events — Create Event (Organizer only)
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new event",
    description="Only organizers can create events. New events start as Pending.",
)
def create_event(
    event_data: EventCreate,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(require_role(UserRole.ORGANIZER))],
):
    return svc.create_event(db, event_data.model_dump(), user)


# ---------------------------------------------------------------------------
# GET /api/events — List Events (role-based filtering)
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=EventListResponse,
    summary="List events",
    description=(
        "Role-based listing: users see approved events, "
        "organizers see their own events, admins see all."
    ),
)
def list_events(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
):
    events, total = svc.list_events(db, user, skip=skip, limit=limit)
    return EventListResponse(events=events, total=total)


# ---------------------------------------------------------------------------
# GET /api/events/{event_id} — Get Event by ID
# ---------------------------------------------------------------------------

@router.get(
    "/{event_id}",
    response_model=EventDetailResponse,
    summary="Get event details",
    description="Returns complete event details including organizer info.",
)
def get_event(
    event_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    return svc.get_event_by_id(db, event_id)


# ---------------------------------------------------------------------------
# PUT /api/events/{event_id} — Update Event
# ---------------------------------------------------------------------------

@router.put(
    "/{event_id}",
    response_model=EventResponse,
    summary="Update an event",
    description=(
        "Organizer can update own events; admin can update any. "
        "Editing an approved event resets its status to Pending."
    ),
)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    return svc.update_event(db, event_id, event_data.model_dump(exclude_unset=True), user)


# ---------------------------------------------------------------------------
# DELETE /api/events/{event_id} — Delete Event
# ---------------------------------------------------------------------------

@router.delete(
    "/{event_id}",
    response_model=MessageResponse,
    summary="Delete an event",
    description="Organizer can delete own events; admin can delete any.",
)
def delete_event(
    event_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    svc.delete_event(db, event_id, user)
    return MessageResponse(message=f"Event {event_id} deleted successfully")


# ---------------------------------------------------------------------------
# PATCH /api/events/{event_id}/approve — Approve Event (Admin only)
# ---------------------------------------------------------------------------

@router.patch(
    "/{event_id}/approve",
    response_model=EventResponse,
    summary="Approve a pending event",
    description="Admin-only. Changes event status from Pending to Approved.",
)
def approve_event(
    event_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
):
    return svc.approve_event(db, event_id)


# ---------------------------------------------------------------------------
# PATCH /api/events/{event_id}/reject — Reject Event (Admin only)
# ---------------------------------------------------------------------------

@router.patch(
    "/{event_id}/reject",
    response_model=EventResponse,
    summary="Reject a pending event",
    description="Admin-only. Changes event status from Pending to Rejected.",
)
def reject_event(
    event_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
):
    return svc.reject_event(db, event_id)

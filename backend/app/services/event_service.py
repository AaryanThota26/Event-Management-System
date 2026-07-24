"""
Event Service
-------------
Business logic for event CRUD and admin approval actions.

All database queries and authorization checks live here.
The API layer (events.py) calls these functions and handles
HTTP concerns (status codes, responses).
"""

from typing import Optional, Tuple, List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.models.event import Event, EventStatus
from app.models.user import User, UserRole


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class EventNotFoundException(HTTPException):
    def __init__(self, event_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found",
        )


class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "You do not have permission to perform this action"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

def create_event(db: Session, event_data: dict, organizer: User) -> Event:
    """
    Create a new event.

    - Only organizers can create events (enforced by route decorator).
    - New events always start as PENDING.
    """
    event = Event(
        title=event_data["title"],
        description=event_data["description"],
        date=event_data["date"],
        time=event_data["time"],
        location=event_data["location"],
        capacity=event_data["capacity"],
        status=EventStatus.PENDING,
        organizer_id=organizer.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------------------------
# Read — List Events (role-based filtering)
# ---------------------------------------------------------------------------

def list_events(
    db: Session,
    user: User,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[Event], int]:
    """
    List events with role-based visibility.

    Rules:
        - Regular users see only APPROVED events.
        - Organizers see all events they created (any status).
        - Admins see all events (any status).

    Returns:
        Tuple of (events, total_count) for pagination.
    """
    query = db.query(Event).options(joinedload(Event.organizer))

    if user.role == UserRole.ADMIN:
        # Admin sees everything
        pass
    elif user.role == UserRole.ORGANIZER:
        # Organizer sees only their own events
        query = query.filter(Event.organizer_id == user.id)
    else:
        # Regular users see only approved events
        query = query.filter(Event.status == EventStatus.APPROVED)

    total = query.count()
    events = (
        query
        .order_by(Event.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return events, total


def get_event_by_id(db: Session, event_id: int) -> Event:
    """Fetch a single event by ID, or raise 404."""
    event = (
        db.query(Event)
        .options(joinedload(Event.organizer))
        .filter(Event.id == event_id)
        .first()
    )
    if not event:
        raise EventNotFoundException(event_id)
    return event


# ---------------------------------------------------------------------------
# Update
# ---------------------------------------------------------------------------

def update_event(
    db: Session,
    event_id: int,
    update_data: dict,
    user: User,
) -> Event:
    """
    Update an event.

    Rules:
        - Organizer can update only their own events.
        - Admin can update any event.
        - If an APPROVED event is edited, status resets to PENDING.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise EventNotFoundException(event_id)

    # Authorization
    if user.role != UserRole.ADMIN and event.organizer_id != user.id:
        raise ForbiddenException("You can only update your own events")

    # Apply partial updates
    for field, value in update_data.items():
        if value is not None:
            setattr(event, field, value)

    # Rule: editing an approved event reverts it to pending
    if event.status == EventStatus.APPROVED:
        event.status = EventStatus.PENDING

    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------

def delete_event(db: Session, event_id: int, user: User) -> None:
    """
    Delete an event.

    Rules:
        - Organizer can delete only their own events.
        - Admin can delete any event.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise EventNotFoundException(event_id)

    if user.role != UserRole.ADMIN and event.organizer_id != user.id:
        raise ForbiddenException("You can only delete your own events")

    db.delete(event)
    db.commit()


# ---------------------------------------------------------------------------
# Admin Actions — Approve / Reject
# ---------------------------------------------------------------------------

def approve_event(db: Session, event_id: int) -> Event:
    """Approve a pending event. Admin-only."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise EventNotFoundException(event_id)

    if event.status != EventStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve event with status '{event.status.value}'. "
                   f"Only pending events can be approved.",
        )

    event.status = EventStatus.APPROVED
    db.commit()
    db.refresh(event)
    return event


def reject_event(db: Session, event_id: int) -> Event:
    """Reject a pending event. Admin-only."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise EventNotFoundException(event_id)

    if event.status != EventStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot reject event with status '{event.status.value}'. "
                   f"Only pending events can be rejected.",
        )

    event.status = EventStatus.REJECTED
    db.commit()
    db.refresh(event)
    return event

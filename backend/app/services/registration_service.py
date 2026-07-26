"""
Registration Service
--------------------
Business logic for event registration and cancellation.

Rules enforced here:
    1. Only authenticated Users can register (enforced by route dependency).
    2. Organizers cannot register for their own events.
    3. Admins cannot register for events.
    4. Duplicate registrations are prevented.
    5. Registration is only allowed for APPROVED events.
    6. Registration is prevented when event capacity is reached.
"""

from typing import Tuple, List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.event import Event, EventStatus
from app.models.registration import Registration
from app.models.user import User, UserRole


# ---------------------------------------------------------------------------
# Custom Exceptions
# ---------------------------------------------------------------------------

class RegistrationException(HTTPException):
    """Base exception for registration-related errors."""
    pass


class EventNotFoundException(HTTPException):
    def __init__(self, event_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found",
        )


class EventNotApprovedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only register for approved events",
        )


class CapacityFullException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event has reached its maximum capacity",
        )


class DuplicateRegistrationException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already registered for this event",
        )


class CannotRegisterForOwnEventException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organizers cannot register for their own events",
        )


class AdminCannotRegisterException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admins cannot register for events",
        )


class RegistrationNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have not registered for this event",
        )


# ---------------------------------------------------------------------------
# Register for an Event
# ---------------------------------------------------------------------------

def register_for_event(db: Session, event_id: int, user: User) -> Registration:
    """
    Register the current user for an event.

    Business Rules:
        1. Admins cannot register for events.
        2. Organizers cannot register for their own events.
        3. Event must exist.
        4. Event must be APPROVED.
        5. Event must not be at full capacity.
        6. User must not already be registered (no duplicates).
    """

    # Rule 1: Admins cannot register
    if user.role == UserRole.ADMIN:
        raise AdminCannotRegisterException()

    # Fetch the event
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise EventNotFoundException(event_id)

    # Rule 2: Organizers cannot register for their own events
    if user.role == UserRole.ORGANIZER and event.organizer_id == user.id:
        raise CannotRegisterForOwnEventException()

    # Rule 3: Event must be approved
    if event.status != EventStatus.APPROVED:
        raise EventNotApprovedException()

    # Rule 4: Check capacity
    current_registrations = (
        db.query(Registration)
        .filter(Registration.event_id == event_id)
        .count()
    )
    if current_registrations >= event.capacity:
        raise CapacityFullException()

    # Rule 5: Check for duplicate registration
    existing = (
        db.query(Registration)
        .filter(
            Registration.user_id == user.id,
            Registration.event_id == event_id,
        )
        .first()
    )
    if existing:
        raise DuplicateRegistrationException()

    # Create the registration
    registration = Registration(
        user_id=user.id,
        event_id=event_id,
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration


# ---------------------------------------------------------------------------
# Cancel Registration
# ---------------------------------------------------------------------------

def cancel_registration(db: Session, event_id: int, user: User) -> None:
    """
    Cancel a user's registration for an event.

    Rules:
        - User can only cancel their own registration.
        - Registration must exist.
    """
    registration = (
        db.query(Registration)
        .filter(
            Registration.user_id == user.id,
            Registration.event_id == event_id,
        )
        .first()
    )
    if not registration:
        raise RegistrationNotFoundException()

    db.delete(registration)
    db.commit()


# ---------------------------------------------------------------------------
# My Registrations
# ---------------------------------------------------------------------------

def get_my_registrations(
    db: Session,
    user: User,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[Registration], int]:
    """
    Get all registrations for the current user with event details.

    Returns:
        Tuple of (registrations, total_count) for pagination.
    """
    query = (
        db.query(Registration)
        .options(joinedload(Registration.event))
        .filter(Registration.user_id == user.id)
    )

    total = query.count()
    registrations = (
        query
        .order_by(Registration.registered_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return registrations, total


# ---------------------------------------------------------------------------
# Event Participants
# ---------------------------------------------------------------------------

def get_event_participants(
    db: Session,
    event_id: int,
    user: User,
) -> dict:
    """
    Get all participants for a specific event.

    Authorization:
        - Organizers can view participants only for their own events.
        - Admins can view participants for any event.

    Returns:
        Dict with event info and participant list.
    """
    # Fetch the event with organizer loaded
    event = (
        db.query(Event)
        .options(joinedload(Event.organizer))
        .filter(Event.id == event_id)
        .first()
    )
    if not event:
        raise EventNotFoundException(event_id)

    # Authorization check
    if user.role == UserRole.ORGANIZER and event.organizer_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view participants for your own events",
        )

    # Fetch registrations with user info loaded
    registrations = (
        db.query(Registration)
        .options(joinedload(Registration.user))
        .filter(Registration.event_id == event_id)
        .all()
    )

    # Extract unique participants
    participants = []
    seen_ids = set()
    for reg in registrations:
        if reg.user.id not in seen_ids:
            participants.append(reg.user)
            seen_ids.add(reg.user.id)

    return {
        "event_id": event.id,
        "event_title": event.title,
        "participants": participants,
        "total_count": len(participants),
    }

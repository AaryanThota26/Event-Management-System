"""
Registration Schemas
--------------------
Pydantic models for Event Registration requests and responses.
"""

from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.schemas.event import EventResponse
from app.schemas.auth import UserResponse


# ---------------------------------------------------------------------------
# Response Schemas
# ---------------------------------------------------------------------------

class RegistrationResponse(BaseModel):
    """Basic registration info returned by the API."""
    id: int
    user_id: int
    event_id: int
    registered_at: datetime

    model_config = {"from_attributes": True}


class RegistrationDetailResponse(BaseModel):
    """Registration with nested event info (for My Registrations)."""
    id: int
    event: EventResponse
    registered_at: datetime

    model_config = {"from_attributes": True}


class EventParticipantsResponse(BaseModel):
    """List of participants for an event."""
    event_id: int
    event_title: str
    participants: List[UserResponse]
    total_count: int

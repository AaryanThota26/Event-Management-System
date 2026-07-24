"""
Event Schemas
-------------
Pydantic models for Event CRUD requests and responses.
"""

from datetime import date as DateType, time as TimeType, datetime
from typing import Optional, List

from pydantic import BaseModel, Field, model_validator

from app.models.event import EventStatus
from app.schemas.auth import UserResponse


# ---------------------------------------------------------------------------
# Request Schemas
# ---------------------------------------------------------------------------

class EventCreate(BaseModel):
    """Schema for creating a new event. Organizer-only endpoint."""
    title: str = Field(
        ..., min_length=3, max_length=200,
        description="Event title",
        examples=["Tech Conference 2025"],
    )
    description: str = Field(
        ..., min_length=10,
        description="Detailed event description",
        examples=["A two-day conference covering AI and cloud computing."],
    )
    date: DateType = Field(
        ..., description="Event date (YYYY-MM-DD)",
        examples=["2025-09-15"],
    )
    time: TimeType = Field(
        ..., description="Event start time (HH:MM)",
        examples=["09:00"],
    )
    location: str = Field(
        ..., min_length=2, max_length=255,
        description="Event venue or location",
        examples=["Convention Center, Hall A"],
    )
    capacity: int = Field(
        ..., gt=0,
        description="Maximum number of attendees",
        examples=[500],
    )


class EventUpdate(BaseModel):
    """
    Schema for updating an event.
    All fields are optional — only provided fields are updated.
    """
    title: Optional[str] = Field(
        None, min_length=3, max_length=200,
        description="Event title",
    )
    description: Optional[str] = Field(
        None, min_length=10,
        description="Detailed event description",
    )
    date: Optional[DateType] = Field(
        None, description="Event date (YYYY-MM-DD)",
    )
    time: Optional[TimeType] = Field(
        None, description="Event start time (HH:MM)",
    )
    location: Optional[str] = Field(
        None, min_length=2, max_length=255,
        description="Event venue or location",
    )
    capacity: Optional[int] = Field(
        None, gt=0,
        description="Maximum number of attendees",
    )

    @model_validator(mode="after")
    def at_least_one_field(self):
        if all(v is None for v in self.model_dump().values()):
            raise ValueError("At least one field must be provided for update")
        return self


# ---------------------------------------------------------------------------
# Response Schemas
# ---------------------------------------------------------------------------

class EventResponse(BaseModel):
    """Full event details returned by the API."""
    id: int
    title: str
    description: str
    date: DateType
    time: TimeType
    location: str
    capacity: int
    status: EventStatus
    organizer_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class EventDetailResponse(EventResponse):
    """Event detail with nested organizer info."""
    organizer: UserResponse


class EventListResponse(BaseModel):
    """Paginated list of events."""
    events: List[EventResponse]
    total: int

"""
Event Model
-----------
Represents an event created by an organizer.

Statuses:
    - pending:  Awaiting admin approval
    - approved: Visible to users, open for registration
"""

import enum
from datetime import datetime, timezone, date, time
from sqlalchemy import (
    String, Text, Enum, DateTime, Date, Time,
    Integer, ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class EventStatus(str, enum.Enum):
    """Event approval status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Event(Base):
    """
    Event table.

    Each event is created by an organizer and must be approved
    by an admin before users can register for it.

    An event has a capacity limit - once the number of
    registrations reaches capacity, no more users can sign up.
    """
    __tablename__ = "events"

    # Primary key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Event details
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        comment="Event title"
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Detailed event description"
    )
    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="Event date"
    )
    time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
        comment="Event start time"
    )
    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Event venue/location"
    )
    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Maximum number of attendees"
    )
    status: Mapped[EventStatus] = mapped_column(
        Enum(EventStatus, name="event_status", native_enum=True),
        default=EventStatus.PENDING,
        nullable=False,
        comment="Event approval status: pending or approved"
    )

    # Foreign key -> users table
    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="ID of the organizer who created this event"
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="Event creation timestamp"
    )

    # Relationships
    # An event belongs to one organizer (User)
    organizer: Mapped["User"] = relationship(
        "User",
        back_populates="events",
        lazy="select",
    )

    # An event can have many registrations
    registrations: Mapped[list["Registration"]] = relationship(
        "Registration",
        back_populates="event",
        lazy="select",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return (
            f"<Event(id={self.id}, title='{self.title}', "
            f"status='{self.status}')>"
        )

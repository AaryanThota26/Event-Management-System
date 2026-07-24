"""
Registration Model
------------------
Represents a user's registration (sign-up) for an event.

This is the join table between User and Event,
with an additional timestamp to track when the
registration happened.
"""

from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Registration(Base):
    """
    Registration table (junction/association table).

    Tracks which users have registered for which events.
    Enforces that a user can only register once per event
    via a UNIQUE constraint on (user_id, event_id).
    """
    __tablename__ = "registrations"

    # Primary key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign keys
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="ID of the registered user"
    )
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="ID of the event"
    )

    # Timestamp
    registered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="When the user registered for this event"
    )

    # Relationships
    # A registration belongs to one user
    user: Mapped["User"] = relationship(
        "User",
        back_populates="registrations",
        lazy="select",
    )

    # A registration belongs to one event
    event: Mapped["Event"] = relationship(
        "Event",
        back_populates="registrations",
        lazy="select",
    )

    # Unique constraint: one registration per user per event
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="uq_user_event_registration"
        ),
    )

    def __repr__(self):
        return (
            f"<Registration(id={self.id}, user_id={self.user_id}, "
            f"event_id={self.event_id})>"
        )

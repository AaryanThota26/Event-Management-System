"""
User Model
----------
Represents a user in the Event Management System.

Roles:
    - user:       Can browse and register for events
    - organizer:  Can create and manage events
    - admin:      Full system access, manages users and events
"""

import enum
from datetime import datetime, timezone
from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    USER = "user"
    ORGANIZER = "organizer"
    ADMIN = "admin"


class User(Base):
    """
    User table.

    Stores user credentials, profile info, and role.
    A user can:
        - Create events (if role is 'organizer' or 'admin')
        - Register for events (any role)
    """
    __tablename__ = "users"

    # Primary key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Profile fields
    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="User's full name"
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="User's unique email address"
    )
    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Hashed password (never store plain text!)"
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", native_enum=True),
        default=UserRole.USER,
        nullable=False,
        comment="User role: user, organizer, or admin"
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="Account creation timestamp"
    )

    # Relationships
    # A user (as organizer) can create many events
    events: Mapped[list["Event"]] = relationship(
        "Event",
        back_populates="organizer",
        lazy="select",
        cascade="all, delete-orphan",
    )

    # A user can have many registrations (event signups)
    registrations: Mapped[list["Registration"]] = relationship(
        "Registration",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"

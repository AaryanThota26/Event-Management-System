"""
Database Configuration Module
------------------------------
Sets up SQLAlchemy engine and session for PostgreSQL.
Uses SQLAlchemy 2.0 DeclarativeBase (modern style).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.

    All models will inherit from this class.
    Uses the modern SQLAlchemy 2.0 declarative base style.
    """
    pass


# Create the SQLAlchemy engine
engine = create_engine(
    settings.effective_database_url,
    echo=settings.DEBUG,         # Log SQL queries when DEBUG=True
    pool_pre_ping=True,          # Verify connections before use
    pool_size=5,                 # Connection pool size
    max_overflow=10,             # Extra connections beyond pool_size
)

# Create sessionmaker - this is used to create database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency that provides a database session.
    Automatically closes the session after use.

    Used in FastAPI route dependencies:
        @app.get("/something")
        def get_something(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Create all tables in the database.
    Uses Base.metadata.create_all() which reads all models
    that inherit from Base and creates their corresponding tables.

    This is idempotent - it only creates tables that don't exist yet.
    """
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def drop_tables():
    """
    Drop all tables. Use with caution!
    Only for development/reset purposes.
    """
    Base.metadata.drop_all(bind=engine)
    print("All database tables dropped!")


def init_db():
    """
    Initialize the database by creating all tables.
    Called on application startup.
    """
    # Import all models here so they register with Base.metadata
    # before create_all() is called
    from app.models import user, event, registration  # noqa: F401
    create_tables()

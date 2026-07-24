#!/usr/bin/env python
"""
Create Database Tables Script
------------------------------
Creates all SQLAlchemy model tables in PostgreSQL.

Usage:
    cd backend
    source venv/Scripts/activate
    python create_tables.py

This script:
    1. Imports all models (User, Event, Registration)
    2. Creates their corresponding database tables
    3. Verifies the tables exist by listing them

This is idempotent - running it multiple times is safe.
It only creates tables that don't already exist.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import inspect, text
from app.core.database import engine, Base, create_tables
from app.models import User, Event, Registration  # noqa: F401


def verify_tables():
    """Verify that all expected tables were created."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("\n" + "=" * 50)
    print("DATABASE TABLES")
    print("=" * 50)

    expected_tables = ["users", "events", "registrations"]

    for table_name in expected_tables:
        if table_name in tables:
            # Get column info for each table
            columns = inspector.get_columns(table_name)
            pk = inspector.get_pk_constraint(table_name)
            fks = inspector.get_foreign_keys(table_name)
            indexes = inspector.get_indexes(table_name)

            print(f"\n  [OK] Table: {table_name}")
            print(f"       Columns: {len(columns)}")
            for col in columns:
                nullable = "NULL" if col["nullable"] else "NOT NULL"
                print(f"         - {col['name']}: {col['type']} ({nullable})")

            if pk["constrained_columns"]:
                print(f"       Primary Key: {pk['constrained_columns']}")

            if fks:
                for fk in fks:
                    print(
                        f"       Foreign Key: {fk['constrained_columns']} "
                        f"-> {fk['referred_table']}.{fk['referred_columns']}"
                    )

            if indexes:
                for idx in indexes:
                    print(
                        f"       Index: {idx['name']} "
                        f"on {idx['column_names']}"
                    )
        else:
            print(f"\n  [MISSING] Table: {table_name}")

    print("\n" + "=" * 50)

    # Check if all expected tables exist
    missing = [t for t in expected_tables if t not in tables]
    if missing:
        print(f"\n  WARNING: Missing tables: {missing}")
        return False
    else:
        print(f"\n  All {len(expected_tables)} tables created successfully!")
        return True


def show_enums():
    """Show PostgreSQL enum types that were created."""
    with engine.connect() as conn:
        result = conn.execute(
            text(
                "SELECT typname, enumlabel "
                "FROM pg_type t "
                "JOIN pg_enum e ON t.oid = e.enumtypid "
                "WHERE typname IN ('user_role', 'event_status') "
                "ORDER BY typname, enumsortorder"
            )
        )
        rows = result.fetchall()

        if rows:
            print("\n" + "=" * 50)
            print("POSTGRESQL ENUM TYPES")
            print("=" * 50)
            current_enum = None
            for typname, enumlabel in rows:
                if typname != current_enum:
                    print(f"\n  Enum: {typname}")
                    current_enum = typname
                print(f"    - {enumlabel}")
            print("=" * 50)


if __name__ == "__main__":
    print("Event Management System - Table Creation")
    print("=" * 50)
    print()

    try:
        # Create all tables
        create_tables()

        # Show enums
        show_enums()

        # Verify tables
        success = verify_tables()

        if success:
            print("\nDatabase setup complete!")
        else:
            print("\nSome tables are missing. Check the output above.")
            sys.exit(1)

    except Exception as e:
        print(f"\nERROR: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure PostgreSQL is running on port 5432")
        print("  2. Check your .env file has correct DB credentials")
        print("  3. Run setup_db.py first to create the database")
        sys.exit(1)

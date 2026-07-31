#!/usr/bin/env python
"""
Add Password Reset Columns Script
---------------------------------
Adds reset_token and reset_token_expiry to the existing users table.

Why this is needed:
    create_all() only creates tables that don't exist yet; it will NOT add
    new columns to an already-created users table. This script applies the
    schema change with ALTER TABLE ... ADD COLUMN IF NOT EXISTS so it is
    safe to run multiple times.

Usage:
    cd backend
    source venv/Scripts/activate
    python add_reset_columns.py
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import inspect, text
from app.core.database import engine


def add_columns():
    """Add the password-reset columns to the users table (idempotent)."""
    statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(64)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ",
    ]
    with engine.begin() as conn:
        for stmt in statements:
            conn.execute(text(stmt))
            print(f"  [OK] {stmt}")
    print("\nColumns added successfully!\n")


def verify_columns():
    """List the users table columns to confirm the new ones exist."""
    inspector = inspect(engine)
    columns = inspector.get_columns("users")
    print("=" * 50)
    print("USERS TABLE COLUMNS")
    print("=" * 50)
    for col in columns:
        print(f"  - {col['name']}: {col['type']} (nullable={col['nullable']})")

    names = [c["name"] for c in columns]
    ok = "reset_token" in names and "reset_token_expiry" in names
    if ok:
        print("\n  [OK] reset_token and reset_token_expiry are present!")
    else:
        print("\n  [MISSING] one or both reset columns were not found!")
    return ok


if __name__ == "__main__":
    print("Event Management System - Add Password Reset Columns")
    print("=" * 50)
    print()

    try:
        add_columns()
        success = verify_columns()
        print("\n" + "=" * 50)
        if success:
            print("Database schema updated successfully!")
        else:
            print("Schema update incomplete. Check the output above.")
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\nERROR: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure PostgreSQL is running on port 5432")
        print("  2. Check your .env file has correct DB credentials")
        sys.exit(1)

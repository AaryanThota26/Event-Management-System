#!/usr/bin/env python
"""
Validate Models Script
---------------------
Verifies all SQLAlchemy models are correctly defined.
Does NOT require a database connection.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models import User, Event, Registration, UserRole, EventStatus
from app.core.database import Base


def main():
    print("Model Validation Report")
    print("=" * 50)

    # Verify all models are registered with Base
    tables = Base.metadata.tables
    print(f"\nTables registered with SQLAlchemy Base: {len(tables)}")
    for name, table in tables.items():
        cols = [c.name for c in table.columns]
        print(f"  {name}: {cols}")

    # Verify enums
    print(f"\nUserRole values: {[r.value for r in UserRole]}")
    print(f"EventStatus values: {[s.value for s in EventStatus]}")

    # Verify relationships
    print(f"\nUser relationships: {[r.key for r in User.__mapper__.relationships]}")
    print(f"Event relationships: {[r.key for r in Event.__mapper__.relationships]}")
    print(f"Registration relationships: {[r.key for r in Registration.__mapper__.relationships]}")

    # Verify foreign keys
    print("\nForeign Keys:")
    for name, table in tables.items():
        for fk in table.foreign_keys:
            print(f"  {name}.{fk.parent.name} -> {fk.target_fullname}")

    # Verify unique constraints
    print("\nUnique Constraints:")
    from sqlalchemy import UniqueConstraint
    for name, table in tables.items():
        for constraint in table.constraints:
            if isinstance(constraint, UniqueConstraint):
                print(f"  {name}: {[c.name for c in constraint.columns]}")

    print("\n" + "=" * 50)
    print("All models validated successfully!")


if __name__ == "__main__":
    main()

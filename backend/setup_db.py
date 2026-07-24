#!/usr/bin/env python
"""
Database Setup Script
---------------------
Creates the PostgreSQL database if it doesn't exist.
Run this script to initialize the database.

Usage: python setup_db.py
"""

import subprocess
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'event_management')


def get_psql_path():
    """Find the psql executable path on Windows."""
    # Common PostgreSQL installation paths on Windows
    possible_paths = [
        r"C:\Program Files\PostgreSQL\17\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\15\bin\psql.exe",
        r"C:\Program Files\PostgreSQL\14\bin\psql.exe",
    ]
    for path in possible_paths:
        if os.path.exists(path):
            return path
    # Try to find it in PATH
    try:
        result = subprocess.run(['where', 'psql'], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip().split('\n')[0]
    except:
        pass
    return None


def run_query(psql_path, query, dbname='postgres'):
    """Run a SQL query using psql."""
    env = os.environ.copy()
    env['PGPASSWORD'] = DB_PASSWORD
    
    cmd = [psql_path, '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER, '-d', dbname, '-c', query]
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    return result


def create_database():
    """Create the event_management database if it doesn't exist."""
    psql_path = get_psql_path()
    
    if not psql_path:
        print("ERROR: psql not found. Please ensure PostgreSQL is installed and in your PATH.")
        sys.exit(1)
    
    print(f"Using psql at: {psql_path}")
    print(f"Connecting as user: {DB_USER}")
    print(f"Target database: {DB_NAME}")
    print()
    
    # Check if database exists
    check_query = f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'"
    result = run_query(psql_path, check_query)
    
    if '1' in result.stdout:
        print(f"Database '{DB_NAME}' already exists!")
    else:
        print(f"Creating database '{DB_NAME}'...")
        create_query = f'CREATE DATABASE "{DB_NAME}"'
        result = run_query(psql_path, create_query)
        
        if result.returncode == 0:
            print(f"Database '{DB_NAME}' created successfully!")
        else:
            print(f"Error creating database: {result.stderr}")
            sys.exit(1)
    
    # Verify connection to the new database
    print()
    print("Verifying connection...")
    verify_query = "SELECT version()"
    result = run_query(psql_path, verify_query, dbname=DB_NAME)
    
    if result.returncode == 0:
        print("Connection successful!")
        print(f"PostgreSQL version: {result.stdout.strip()}")
    else:
        print(f"Connection failed: {result.stderr}")
        sys.exit(1)


if __name__ == '__main__':
    print("=" * 50)
    print("Event Management System - Database Setup")
    print("=" * 50)
    print()
    create_database()
    print()
    print("Setup complete!")

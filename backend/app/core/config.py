"""
Core Configuration Module
-------------------------
Loads environment variables and provides app settings.
Uses pydantic-settings for type-safe configuration.
"""

import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Event Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database (PostgreSQL)
    # Full connection string. Development reads it from backend/.env
    # (local PostgreSQL); production reads it from Render environment
    # variables (Neon). When set, it takes priority over the DB_* fields.
    DATABASE_URL: str | None = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "event_management"

    @property
    def effective_database_url(self) -> str:
        """Resolved PostgreSQL connection URL."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    # JWT (will be used in later phases)
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Email / Password Reset (Resend)
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "EventPro <onboarding@resend.dev>"
    FRONTEND_URL: str = "http://localhost:5173"
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    # CORS - comma-separated list of allowed frontend origins
    CORS_ORIGINS: str = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5174,http://127.0.0.1:5174,"
        "https://event-management-system-ruby-gamma.vercel.app"
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

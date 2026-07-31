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
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "event_management"

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # JWT (will be used in later phases)
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Email / Password Reset (Resend)
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "EventPro <onboarding@resend.dev>"
    FRONTEND_URL: str = "http://localhost:5173"
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

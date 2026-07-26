"""
Event Management System - FastAPI Application
---------------------------------------------
Main entry point for the backend API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth_router, events_router, registrations_router


def create_app() -> FastAPI:
    """Application factory pattern for creating the FastAPI app."""

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="API for managing events, users, organizers, and attendees.",
        docs_url="/docs",      # Swagger UI
        redoc_url="/redoc",    # ReDoc documentation
    )

    # CORS Middleware - Allow frontend to communicate with backend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],  # Vite dev server
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- API Routers ---
    app.include_router(
        auth_router,
        prefix="/api/auth",
        tags=["Authentication"],
    )
    app.include_router(
        events_router,
        prefix="/api/events",
        tags=["Events"],
    )
    app.include_router(
        registrations_router,
        prefix="/api/registrations",
        tags=["Registrations"],
    )

    @app.get("/", tags=["Health"])
    def root():
        """Health check endpoint."""
        return {
            "message": f"Welcome to {settings.APP_NAME}",
            "version": settings.APP_VERSION,
            "status": "running",
            "docs": "/docs",
        }

    @app.get("/health", tags=["Health"])
    def health_check():
        """Detailed health check."""
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }

    return app


app = create_app()

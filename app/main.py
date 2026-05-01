# -----------------------------------------------------------------
# File:    app/main.py
# Purpose: FastAPI application entry point for the Cognifer backend
#
# Responsibilities:
#   - Create the FastAPI app instance
#   - Register CORS middleware (restrict to known frontend origins)
#   - Mount all API routers under the /api prefix
#   - Serve the compiled React frontend as static files
#   - Catch-all route returns index.html for client-side routing
# -----------------------------------------------------------------

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.routes import contact


# ── App instance ──────────────────────────────────────────────────
app = FastAPI(
    title="Cognifer API",
    description="Backend API for the Cognifer website",
    version="0.1.0",
    # Hide the auto-generated docs in production via env var.
    # Set COGNIFER_ENV=production on DigitalOcean to disable them.
    docs_url=None if os.getenv("COGNIFER_ENV") == "production" else "/docs",
    redoc_url=None if os.getenv("COGNIFER_ENV") == "production" else "/redoc",
)


# ── CORS middleware ───────────────────────────────────────────────
# Only the origins listed here are allowed to call the API from
# a browser. In production this must be your exact DigitalOcean URL.
# In local dev the Vite proxy handles CORS so this isn't needed,
# but keeping it correct here avoids surprises on deploy.
#
# FRONTEND_URL is set as an environment variable on DigitalOcean
# under Apps → cognifer-8xexk → Settings → Environment Variables.
# The hardcoded fallback is used only if the env var is missing.
ALLOWED_ORIGINS = [
    # Production frontend (DigitalOcean App Platform)
    os.getenv("FRONTEND_URL", "https://cognifer-8xexk.ondigitalocean.app"),
    # Local development (Vite dev server)
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],   # only what the app actually needs
    allow_headers=["Content-Type"],
)


# ── API routers ───────────────────────────────────────────────────
# Each router is mounted under /api so all backend endpoints are
# clearly separated from frontend static asset URLs.
app.include_router(contact.router, prefix="/api", tags=["contact"])


# ── Static frontend assets ────────────────────────────────────────
# The Dockerfile copies the Vite build output into app/static/.
# We serve it here so the single Docker image delivers both the
# API and the compiled React app without a separate web server.
STATIC_DIR = Path(__file__).parent / "static"

if STATIC_DIR.exists():
    # Mount assets (JS, CSS, images) at /assets so Vite's hashed
    # filenames resolve correctly.
    app.mount(
        "/assets",
        StaticFiles(directory=STATIC_DIR / "assets"),
        name="assets",
    )

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str) -> FileResponse:
        """
        Catch-all route for React client-side routing.

        Any path that isn't matched by an API route above returns
        index.html, letting React Router render the correct page.
        Without this, a hard refresh on e.g. /products/sacco-analytics
        would return a 404 from the server.
        """
        return FileResponse(STATIC_DIR / "index.html")
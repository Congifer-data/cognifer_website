# -------------------------
# Stage 1: Build React app
# -------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Only copy package json first for caching
COPY frontend/package*.json ./
RUN npm ci --silent

# Copy source and build
COPY frontend/ .
RUN npm run build

# -------------------------
# Stage 2: Python runtime
# -------------------------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
WORKDIR /usr/src/app

# Install minimal OS deps (keep small but allow compiling wheel if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
 && rm -rf /var/lib/apt/lists/*

# Copy backend source and requirements
COPY app/ ./app/
COPY app/requirements.txt ./requirements.txt

# Copy built frontend into backend static folder (result: /usr/src/app/app/static/index.html)
COPY --from=frontend-builder /frontend/build ./app/static

# Install Python deps (done as root)
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Create non-root user and fix ownership of app files
RUN useradd --create-home appuser \
 && chown -R appuser:appuser /usr/src/app

USER appuser

EXPOSE 8080

# Bind to DO-provided $PORT if present; single worker + single thread for low memory
CMD ["sh","-c","gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 1 --timeout 120"]

# Resume Matcher Docker Image
# Multi-stage build — dev stages FIRST so `--target development` never reaches
# the `npm run build` step (which can fail on i18n locale-parity drift). Prod
# stages are LAST so a bare `docker build .` still produces the prod image.
#
# Build targets:
#   docker build .                                    → production (last stage)
#   docker build --target development                 → development (no npm run build)
#   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build  → dev

# ============================================
# Stage 1: Install Frontend Dependencies (DEVELOPMENT)
# ============================================
# Installs ALL node deps (incl. devDeps) WITHOUT building — so the dev image
# builds even while `npm run build` is blocked (e.g. i18n locale-parity drift).
# Same node:22-bookworm base as frontend-builder for glibc/Debian compatibility
# with the python:3.13-slim-bookworm layer below.
FROM node:22-bookworm AS frontend-deps

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/frontend

# Copy package files first for layer caching.
COPY apps/frontend/package*.json ./

# `npm install` (not `npm ci`) tolerates lockfile/package drift in development.
RUN npm install

# ============================================
# Stage 2: Development Image (Node + Python + Playwright)
# ============================================
# Runs both the frontend (Next.js dev / Turbopack HMR) and the backend
# (uvicorn --reload) in ONE container, mirroring the prod single-container model.
# Source is bind-mounted at runtime via docker-compose.dev.yml; this stage only
# installs dependencies. PLACED BEFORE frontend-builder so `--target development`
# never reaches the `npm run build` step.
FROM python:3.13-slim-bookworm AS development

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1

# System dependencies — same Playwright runtime libraries as the prod image,
# plus curl for the backend health poll.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the full Node.js toolchain from the node stage. The prod image copies
# ONLY the `node` binary (it runs the prebuilt standalone server); the dev
# image also needs npm/npx to launch `next dev`.
COPY --from=frontend-deps /usr/local/bin/node /usr/local/bin/node
COPY --from=frontend-deps /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=frontend-deps /usr/local/bin/npm /usr/local/bin/npm
COPY --from=frontend-deps /usr/local/bin/npx /usr/local/bin/npx

# ============================================
# Backend Setup
# ============================================
COPY apps/backend/pyproject.toml /app/apps/backend/
COPY apps/backend/app /app/apps/backend/app

WORKDIR /app/apps/backend
RUN pip install .

# ============================================
# Frontend Dependencies (seeded; protected by compose named volume)
# ============================================
# Seed node_modules so `next dev` can start immediately. The
# `frontend-node-modules` named volume in docker-compose.dev.yml preserves this
# directory at runtime so the host bind-mount (./apps) cannot shadow it.
# If package.json changes, re-seed: docker compose ... down -v
COPY --from=frontend-deps /app/apps/frontend/node_modules /app/apps/frontend/node_modules

# ============================================
# Data Directory, Playwright & Non-root User
# ============================================
RUN mkdir -p /app/apps/backend/data

RUN useradd -m -u 1000 appuser \
    && chown -R appuser:appuser /app

USER appuser

# Install Playwright Chromium as appuser so browsers land in the appuser cache
# that start-dev.sh checks for.
RUN python -m playwright install chromium

EXPOSE 3000

WORKDIR /app

# Dev entrypoint — uvicorn --reload + next dev (Turbopack HMR).
COPY --chown=appuser:appuser docker/start-dev.sh /app/start-dev.sh
RUN sed -i 's/\r$//' /app/start-dev.sh && chmod +x /app/start-dev.sh

# Health check on internal backend port (independent of host port mapping).
HEALTHCHECK --interval=10s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://127.0.0.1:8000/api/v1/health || exit 1

CMD ["/app/start-dev.sh"]

# ============================================
# Stage 3: Build Frontend (PRODUCTION)
# ============================================
FROM node:22-bookworm AS frontend-builder

# Build argument for API URL (allows customization at build time)
# Default routes requests through Next.js rewrites on the same origin.
ARG NEXT_PUBLIC_API_URL=/
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app/frontend

# Copy package files first for better caching
COPY apps/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY apps/frontend/ ./

# Build the frontend
RUN npm run build

# ============================================
# Stage 4: Final Production Image (default build target)
# ============================================
# This stage is LAST so a bare `docker build .` produces the production image.
# The dev image above is only built with `--target development`.
FROM python:3.13-slim-bookworm

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    # Playwright dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Node.js runtime from frontend builder for reproducible runtime behavior.
COPY --from=frontend-builder /usr/local/bin/node /usr/local/bin/node

# ============================================
# Backend Setup
# ============================================
COPY apps/backend/pyproject.toml /app/backend/
COPY apps/backend/app /app/backend/app

WORKDIR /app/backend

# Install Python dependencies
RUN pip install .

# ============================================
# Frontend Setup
# ============================================
WORKDIR /app/frontend

# Copy standalone frontend runtime from builder stage
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static
COPY --from=frontend-builder /app/frontend/public ./public

# ============================================
# Startup Script
# ============================================
COPY docker/start.sh /app/start.sh
# Convert CRLF to LF (fixes Windows line ending issues) and make executable
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

# ============================================
# Data Directory & Volume
# ============================================
RUN mkdir -p /app/backend/data

# Create a non-root user for security
RUN useradd -m -u 1000 appuser \
    && chown -R appuser:appuser /app

USER appuser

# Install Playwright Chromium as appuser (so browsers are in correct location)
RUN python -m playwright install chromium

# Expose the public port (backend remains internal on 8000)
EXPOSE 3000

# Volume for persistent data
VOLUME ["/app/backend/data"]

# Set working directory
WORKDIR /app

# Health check on internal backend port only (independent of host port mapping).
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=5 \
    CMD curl -f http://127.0.0.1:8000/api/v1/health || exit 1

# Start the application
CMD ["/app/start.sh"]

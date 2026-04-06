# ============================================================================
# CALC Scientific Calculator — Frontend Dockerfile
# ============================================================================
# Multi-stage build for the React/TypeScript SPA.
#   Stage 1 (build): Compiles TypeScript and bundles the Vite production build.
#   Stage 2 (serve): Serves the static bundle via Nginx with SPA routing.
#
# The final image contains ONLY Nginx and the optimised static assets,
# keeping the production image minimal (no Node.js runtime, no
# node_modules, no source code).
# ============================================================================

# ---------------------------------------------------------------------------
# Stage 1 — Build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

LABEL maintainer="CALC Team"
LABEL description="CALC Scientific Calculator Frontend"

WORKDIR /app

# Copy dependency manifests first so that the expensive `npm ci` layer is
# cached as long as package.json / package-lock.json remain unchanged.
COPY package.json package-lock.json* ./

# Install dependencies deterministically.  `npm ci` is preferred over
# `npm install` in CI/Docker contexts because it installs exactly the
# versions recorded in the lock-file and is faster.
RUN npm ci

# Copy the rest of the application source code.
COPY . .

# Build the production bundle.  The project's build script runs the
# TypeScript compiler (`tsc`) followed by Vite's optimised production
# bundler, producing output in the `dist/` directory.
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — Serve
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

# Copy the custom Nginx configuration that handles SPA routing
# (try_files fallback to index.html), gzip compression, static-asset
# caching, and the /api proxy to the Flask backend.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static assets from the build stage into the
# directory that Nginx serves.
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.  Docker Compose maps
# the external port 3000 to this internal port (3000:80).
EXPOSE 80

# Run Nginx in the foreground so Docker can manage the process lifecycle.
CMD ["nginx", "-g", "daemon off;"]

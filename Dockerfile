# ---------- Stage 1: Build the frontend ----------
FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

# Install frontend deps first (better layer caching)
COPY frontend/Lernify/package.json frontend/Lernify/package-lock.json* ./
RUN npm ci || npm install

# Copy frontend source and build
COPY frontend/Lernify/ ./
# Same-origin API: ensure no dev URL gets baked into the bundle
ENV VITE_API_URL=""
RUN npm run build

# ---------- Stage 2: Backend runtime ----------
FROM node:20-slim AS backend-runtime

WORKDIR /app

# Runtime libs for native image/PDF modules (canvas, sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libcairo2 libpango-1.0-0 libjpeg62-turbo libgif7 librsvg2-2 \
  && rm -rf /var/lib/apt/lists/*

# Install backend deps (canvas/sharp/bcrypt ship glibc prebuilds on Debian)
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci || npm install

# Copy backend source
COPY backend/ ./

# Clean out anything committed from source copy; create fresh runtime dirs
RUN rm -rf public src/uploads && mkdir -p src/uploads/documents src/uploads/profileImage public

# Bring in the built frontend from stage 1
COPY --from=frontend-build /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

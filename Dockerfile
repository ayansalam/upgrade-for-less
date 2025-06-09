# Stage 1: Build frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/

# Build frontend
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine as backend-builder

WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./
COPY server/tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY server/src/ ./src/

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache tini

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy backend build artifacts
COPY --from=backend-builder /app/server/dist ./dist
COPY --from=backend-builder /app/server/package*.json ./

# Copy frontend build artifacts
COPY --from=frontend-builder /app/frontend/dist ./public

# Install production dependencies only
RUN npm ci --only=production

# Create necessary directories with correct permissions
RUN mkdir -p /app/logs /app/uploads \
    && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001

# Expose port
EXPOSE 3001

# Use tini as init
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/index.js"] 
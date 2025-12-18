# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies with cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --prefer-offline --no-audit

# Copy source code AFTER dependencies
COPY --link . .

# Production stage
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy from builder with --link for better caching
# Use numeric UIDs with --link (--link doesn't resolve user names)
COPY --link --from=builder --chown=1001:1001 /app/node_modules ./node_modules
COPY --link --from=builder --chown=1001:1001 /app/src ./src
COPY --link --from=builder --chown=1001:1001 /app/scripts ./scripts
COPY --link --from=builder --chown=1001:1001 /app/package.json ./

# Create forms directory with wider permissions (allows container + host user to write)
RUN mkdir -p /app/forms && chmod 777 /app/forms

# Set umask to create files with more permissive default permissions (664)
ENV UMASK=0002

USER nodejs

EXPOSE 3001

CMD ["node", "src/index.js"]

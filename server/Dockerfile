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
COPY --link --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --link --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --link --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs

EXPOSE 3001

CMD ["node", "src/index.js"]

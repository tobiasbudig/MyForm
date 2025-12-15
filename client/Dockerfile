# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS builder

WORKDIR /app

# Build arguments
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies with cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Copy source code AFTER dependencies
COPY --link . .

# Build with cache
RUN --mount=type=cache,target=/app/node_modules/.vite \
    npm run build

# Production stage
FROM nginx:alpine

COPY --link --from=builder /app/dist /usr/share/nginx/html
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

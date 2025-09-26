# Multi-stage Dockerfile for both development and production
FROM node:18-alpine as base

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code and assets
COPY client/ ./client/
COPY attached_assets/ ./attached_assets/
COPY components.json ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./

# Build argument to determine mode
ARG BUILD_MODE=production
ARG VITE_KEYCLOAK_URL=http://localhost:8080
ARG VITE_KEYCLOAK_REALM=orion
ARG VITE_KEYCLOAK_CLIENT_ID=orion-client

# Set environment variables
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

# Development stage
FROM base as development
WORKDIR /app/client
EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173/ || exit 1
CMD ["sh", "-c", "cd .. && npm run dev -- --host 0.0.0.0"]

# Build stage for production
FROM base as build
WORKDIR /app/client
RUN cd .. && npm run build

# Production stage
FROM nginx:alpine as production

# Copy built application  
COPY --from=build /app/dist/public /usr/share/nginx/html

# Copy nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx
RUN chown -R nextjs:nodejs /var/log/nginx
RUN chown -R nextjs:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nextjs:nodejs /var/run/nginx.pid

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

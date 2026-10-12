# ==========================================
# Dockerfile for React Vite Frontend
# Multi-stage build: Node.js build -> Nginx
# ==========================================

# Stage 1: Build the React static files with Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions and install packages
COPY package*.json ./
RUN npm install

# Build arguments for production API base URL
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve production bundle using high-performance Nginx web server
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration supporting React Router SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

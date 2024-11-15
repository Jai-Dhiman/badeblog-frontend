# Build stage
FROM node:20-slim as build-stage

WORKDIR /app

# Copy package files
COPY package*.json .npmrc ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the app
ENV NODE_ENV=production
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx pid directory
RUN mkdir -p /run/nginx

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
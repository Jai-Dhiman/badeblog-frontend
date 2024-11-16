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

# Copy nginx template
COPY nginx.template.conf /etc/nginx/conf.d/default.template

# Create entrypoint script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'envsubst "$(env | cut -d= -f1 | sed -e '"'"'s/^/\$/'"'"')" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

# Use the script as entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
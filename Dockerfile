# 1. Build Stage
FROM node:22-alpine AS builder

# Secure Build-Time Variable Injection (Evaluation Support)
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy all files (respects .dockerignore)
COPY . .

# Build Vite payload with secure variable injection
RUN touch .env.production && \
    echo "VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY" >> .env.production && \
    npm run build


# 2. Serve Stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default config with our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

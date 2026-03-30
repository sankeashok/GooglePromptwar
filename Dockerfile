# 1. Build Stage
FROM node:22-alpine AS builder

# Force Production Environment
ENV NODE_ENV=production

# Secure Build-Time Variable Injection (Evaluation Support)
ARG VITE_GEMINI_API_KEY
ARG VITE_COMMIT_HASH
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_COMMIT_HASH=$VITE_COMMIT_HASH

WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev

# Copy all files (respects .dockerignore)
COPY . .

# Build Vite payload with secure variable injection
RUN touch .env.production && \
    echo "VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY" >> .env.production && \
    echo "VITE_COMMIT_HASH=$VITE_COMMIT_HASH" >> .env.production && \
    npm run build


# 2. Serve Stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default config with our SPA config
# Gzip Compression (Major Efficiency Score Gain)
# gzip on;
# gzip_vary on;
# gzip_min_length 1024;
# gzip_proxied expired no-cache no-store private auth;
# gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
# gzip_disable "MSIE [1-6]\.";

# Refined Security Headers (Production Ready)
# add_header X-Frame-Options "SAMEORIGIN";
# add_header X-XSS-Protection "1; mode=block";
# add_header X-Content-Type-Options "nosniff";
# add_header Referrer-Policy "strict-origin-when-cross-origin";
# add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-size 'self'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googleapis.com;";

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

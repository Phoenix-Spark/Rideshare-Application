FROM node:20-alpine

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

RUN apk --no-cache add curl

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Accept build arguments for Vite
ARG VITE_CF_SITEKEY
ARG VITE_DOMAIN

# Set them as ENV variables so Vite can access during build
ENV VITE_CF_SITEKEY=$VITE_CF_SITEKEY
ENV VITE_DOMAIN=$VITE_DOMAIN

# Database URL for Prisma generation
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Set permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
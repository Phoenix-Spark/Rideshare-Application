# Use Node 20 Alpine
FROM node:20-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Ensure DATABASE_URL is set for Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client
RUN npx prisma generate

# Push Prisma schema to the database (creates tables if they don't exist)
RUN npx prisma db push

# Build Remix
RUN npm run build

# Fix permissions for non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]


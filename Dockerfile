FROM node:20-alpine

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN apk --no-cache add curl

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Accept build arguments
ARG DATABASE_URL
ARG VITE_CF_SITEKEY
ARG VITE_DOMAIN
ARG VITE_DOMAIN_PORT

# Set them as ENV variables
ENV DATABASE_URL=$DATABASE_URL
ENV VITE_CF_SITEKEY=$VITE_CF_SITEKEY
ENV VITE_DOMAIN=$VITE_DOMAIN
ENV VITE_DOMAIN_PORT=$VITE_DOMAIN_PORT

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Set permissions
RUN chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
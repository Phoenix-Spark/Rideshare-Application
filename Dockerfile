FROM node:25-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN npm run build

FROM node:25-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=nodejs:nodejs prisma ./prisma
COPY --chown=nodejs:nodejs prisma.config.ts ./prisma.config.ts
RUN npx prisma generate

# Copy built application from build stage
COPY --chown=nodejs:nodejs --from=build /app/build ./build
# Copy any other necessary runtime files (adjust as needed)
COPY --chown=nodejs:nodejs --from=build /app/public ./public

COPY --chown=nodejs:nodejs server.ts ./server.ts

USER nodejs
EXPOSE 3000

CMD ["node", "server.ts"]

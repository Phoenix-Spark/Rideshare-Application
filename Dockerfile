FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN npm run build
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

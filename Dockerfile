# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Runner
FROM node:20-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S rtlt && adduser -S rtlt -G rtlt

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views
COPY --from=builder /app/app.js ./

# Set correct permissions
RUN chown -R rtlt:rtlt /app

USER rtlt

EXPOSE 5000

CMD [ "npm", "start" ]
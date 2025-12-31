# Multi-stage build for optimized image size
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev deps for building)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY .env.example ./

# Build TypeScript to JavaScript
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Environment variables
ENV NODE_ENV=production
ENV PORT=5161

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder /app/.env.example ./.env.example
COPY --chown=nodejs:nodejs tsconfig.json ./

# Set proper permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5161/health', (r) => {if(r.statusCode===200)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

# Expose port
EXPOSE 5161

# Start the application
CMD ["node", "build/app.js"]
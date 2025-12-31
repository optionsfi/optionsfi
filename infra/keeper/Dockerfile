FROM node:20-alpine

WORKDIR /app

# Copy package files from infra/keeper (Railway uses repo root as context)
COPY infra/keeper/package*.json ./

# Install dependencies
RUN npm ci

# Copy source and config
COPY infra/keeper/src ./src
COPY infra/keeper/idl ./idl
COPY infra/keeper/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3010/health || exit 1

# Start server
CMD ["npm", "start"]

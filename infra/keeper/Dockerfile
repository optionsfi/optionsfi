FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY infra/keeper/package.json infra/keeper/package-lock.json ./
RUN npm ci

# Copy all source files in one layer
COPY infra/keeper/src/ ./src/
COPY infra/keeper/idl/ ./idl/
COPY infra/keeper/tsconfig.json ./tsconfig.json

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3010/health || exit 1

# Start server
CMD ["npm", "start"]

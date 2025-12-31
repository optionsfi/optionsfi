FROM node:20-alpine

WORKDIR /app

# Copy only package.json (let npm generate fresh lock)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src/ ./src/
COPY idl/ ./idl/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3010/health || exit 1

# Start server
CMD ["npm", "start"]

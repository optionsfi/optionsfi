FROM node:20-alpine

WORKDIR /app

# Copy entire keeper directory first, then move files to correct location
COPY infra/keeper/ /tmp/keeper/

# Move package files and install
RUN cp /tmp/keeper/package.json /tmp/keeper/package-lock.json ./ && npm ci

# Copy source, IDL, and config
RUN cp -r /tmp/keeper/src ./src && \
    cp -r /tmp/keeper/idl ./idl && \
    cp /tmp/keeper/tsconfig.json ./tsconfig.json

# Clean up temp
RUN rm -rf /tmp/keeper

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3010/health || exit 1

# Start server
CMD ["npm", "start"]

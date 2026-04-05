# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN cd client && npm install
RUN cd server && npm install

# Copy all source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Expose backend port
EXPOSE 3001

# Start backend server
CMD ["node", "server/app.js"]
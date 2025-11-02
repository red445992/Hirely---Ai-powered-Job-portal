FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY next.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Use Next.js start command instead of serve
CMD ["npm", "start"]
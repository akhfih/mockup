# Gunakan image Node.js resmi
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Copy file .env.local
COPY .env.local .env.local

# Build Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Jalankan Next.js production server
CMD ["npm", "start"]
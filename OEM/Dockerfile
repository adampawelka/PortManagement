FROM node:18-alpine

WORKDIR /app

# 1. Install build tools
RUN apk add --no-cache python3 make g++

# 2. Copy package files
COPY package*.json ./

# 3. Install dependencies
RUN npm ci
RUN npm install uuid@8.3.2

# 4. Copy source code
COPY . ./
COPY src/ ./src/
COPY tsconfig.json ./

# 5. Check what files exist
RUN ls -la src/

# 6. Find the correct entry point
RUN find src/ -name "*.ts" | head -5

# 7. Build TypeScript
RUN npx tsc --skipLibCheck

# Build TypeScript
RUN npm run build

# 8. Check build output
RUN ls -la build/

# 9. Set environment
ENV PORT=5161
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://oem_admin:PORTMANAGEMENT3DLE04@10.9.20.216:27017/portoemdb?authSource=admin
ENV JWT_SECRET=LVAR2f6MoYTtL+GiitLI5Eos5y4ws7N3zXT6/1HwNvs=
ENV CORS_ORIGINS=http://localhost:5173

# 10. Expose port
EXPOSE 5161

# 11. Find and use correct entry point
CMD ["sh", "-c", "if [ -f 'build/app.js' ]; then node build/app.js; elif [ -f 'build/src/app.js' ]; then node build/src/app.js; elif [ -f 'app.js' ]; then node app.js; else find . -name 'app.js' | head -1 | xargs node; fi"]

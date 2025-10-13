# ----------------------------
# Stage 1: Build Backend
# ----------------------------
FROM gradle:7.6.0-jdk17 AS backend-build
WORKDIR /app

# Copy backend source
COPY BE-Hyper-main/ ./
RUN chmod +x ./gradlew

# Build backend JAR
RUN ./gradlew clean bootJar --no-daemon -x test

# ----------------------------
# Stage 2: Build Frontend
# ----------------------------
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy package.json and install dependencies
COPY implantweb-main/package*.json ./
RUN npm install --silent

# Copy frontend source and build
COPY implantweb-main/ ./
RUN npm run build

# ----------------------------
# Stage 3: Final Image
# ----------------------------
FROM node:18-bullseye AS final
WORKDIR /app

# Install JDK for backend
RUN apt-get update && apt-get install -y openjdk-17-jdk && rm -rf /var/lib/apt/lists/*

# Install serve to host frontend
RUN npm install -g serve

# Copy backend JAR (use wildcard to match actual JAR name)
COPY --from=backend-build /app/build/libs/*.jar myapp.jar

# Copy frontend build
COPY --from=frontend-build /app/build /app/frontend

# Copy wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Environment variables (override at runtime for production)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/implant?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Hyperminds@2025

# Expose backend and frontend ports
EXPOSE 8080 3000

# Start backend + frontend
CMD ["/bin/sh", "/start.sh"]

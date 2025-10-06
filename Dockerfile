# ----------------------------
# Stage 1: Build Backend
# ----------------------------
FROM gradle:7.6.0-jdk17 AS backend-build
WORKDIR /app

COPY BE-Hyper-main/ ./
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon -x test

# ----------------------------
# Stage 2: Build Frontend
# ----------------------------
FROM node:18-alpine AS frontend-build
WORKDIR /app

COPY implantweb-main/package*.json ./
RUN npm install --silent
COPY implantweb-main/ ./
RUN npm run build

# ----------------------------
# Stage 3: Final Image
# ----------------------------
FROM node:18-bullseye AS final
WORKDIR /app

# Install JDK for backend
RUN apt-get update && apt-get install -y openjdk-17-jdk && rm -rf /var/lib/apt/lists/*

# Copy backend JAR
COPY --from=backend-build /app/build/libs/myapp.jar myapp.jar

# Copy frontend build
COPY --from=frontend-build /app/build /app/frontend

# Install serve to serve frontend
RUN npm install -g serve

# Expose ports
EXPOSE 3000 8080

# Copy wait-for-it script to wait for MySQL
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Environment variables for Spring Boot
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/implant?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Hyperminds@2025

# Start backend after MySQL is ready, then frontend on 3000
CMD ["/bin/sh", "-c", "/wait-for-it.sh mysql:3306 -- java -jar myapp.jar & serve -s /app/frontend -l 3000"]

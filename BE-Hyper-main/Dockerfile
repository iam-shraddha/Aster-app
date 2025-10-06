# Stage 1: Build the application
FROM gradle:7.6.0-jdk17 AS build

COPY --chown=gradle:gradle . /app

WORKDIR /app

RUN chmod +x ./gradlew

RUN ./gradlew bootJar

# Stage 2: Run the application

FROM openjdk:17-jdk-slim

VOLUME /tmp

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]


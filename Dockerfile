# Build Stage
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /usr/src/app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Copy maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copy project source (both Java and React frontend in src/main/frontend)
COPY src ./src

# Build the Spring Boot application (this also builds the React app via frontend-maven-plugin)
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the compiled executable JAR from the builder stage
COPY --from=builder /usr/src/app/target/store-metrics-monolith-1.0.0-SNAPSHOT.jar app.jar

# Expose the Spring Boot default port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]

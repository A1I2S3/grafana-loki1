# Use a slim base image
FROM debian:bullseye-slim

# Install OpenJDK 17
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Set the JAVA_HOME environment variable
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file to the container
COPY target/user-0.0.1-SNAPSHOT.jar .

COPY . .

# Set the command to run the application
CMD ["java", "-jar", "user-0.0.1-SNAPSHOT.jar"]

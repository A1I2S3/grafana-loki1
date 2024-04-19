# Grafana

Grafana is an open-source analytics and visualization platform designed to help users understand and monitor metrics, logs, and other data from various sources. Originally focused on time-series data, Grafana has evolved into a comprehensive monitoring and observability solution used by millions of users worldwide.

# LOKI

Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. It is designed to be very cost effective and easy to operate. It does not index the contents of the logs, but rather a set of labels for each log stream.

# Setting up Loki with Grafana dashboard

## Step 1: Install Loki and Grafana
To set up Loki and Grafana, follow these steps:

1. Install Docker: Ensure that Docker is installed on your system.

2. Create Docker Compose File: Create a docker-compose.yml file with the following contents:

```bash
version: '3'

services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - ./loki:/etc/loki

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
```
3. Start Containers: Run the following command to start Loki and Grafana containers

```bash
docker compose build

docker compose up -d
```
## Step 2: Configure Data Sources in Grafana

1. Access Grafana by navigating to http://localhost:3000 in your web browser.
2. Log in using the default credentials with username and password both as admin.You can change it later by going to configurations > user.
3. Navigate to Configuration > Data Sources.
4. Click on "Add data source" and select Loki.
5. Configure the Loki data source with the URL http://loki:3100
6. Click on save and test. you can see the data source is created successfully.

# Develop web applications

1. web application using java

2. web application using node.js

3. web application using python

## web application using java
1. Create a java project 
2. make sure you have maven installed in your system
3. create a pom.xml file with all the dependencies required for the project
4. This can be done either by using maven or gradle
5. you can either create the files manually or use spring initializr to create the project with the following structure
6. when your doing manually you need to make sure that pom.xml file is in the root directory of the project make sure u have the following structure

```bash
 project
    |
    |___/src
    |      |_/main
    |         |_/java
    |             |_/yourapplication.java
    |
    |
    |__/pom..xml
```
7. you can run the application using the command 
```bash
mvn spring-boot:run
```
8. import logger to the application and Use a file handler to create a file and store the external logs.This generates logs in your applications

## web application using node.js
1. Create a node.js project which perform CRED operations
2. Run the commands to install all the dependencies and packages
```bash
npm init -y
npm install
```
3. Use logger and log-to-file to create a file and store the external logs.This generates logs in your applications

## web application using python
1.  Create a python project which perform CRED operations
2.  Run the commands to install all the dependencies and packages 
```bash
pip install 
```
3. Generate requirements.txt: Once your dependencies are installed, you can generate the requirements.txt file using the pip freeze command. This command outputs all currently installed packages and their versions. 
```bash
pip freeze > requirements.txt
```
4. Generate a file to store the external logs 
```bash
log_to_file(log_message, "filename.txt")

def log_to_file(message, filename):
    with open(filename, "a") as file:
        file.write(message + "\n")
```

# Creating the docker images for all the Applications
1. Docker image for java application
```bash
# Use a slim base image
FROM debian:bullseye-slim

# Install OpenJDK 
RUN apt-get update && apt-get install -y openjdk-<java-version>-jdk

# Set the JAVA_HOME environment variable
ENV JAVA_HOME /usr/lib/jvm/java-<java-version>-openjdk-amd64

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file to the container
COPY target/userapplication.jar .

COPY . .

# Set the command to run the application
CMD ["java", "-jar", "yourapplication.jar"]

```
2. Docker image for python application
```bash
# Use the official Python image as base
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libc-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port
EXPOSE <port number for python application>

# Command to run the application
CMD ["python", "yourapplication.py"]
```
3. Docker image for nodejs application
```bash
# Use the official Node.js image as a base
FROM node:<node version>

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 
EXPOSE <port number for node.js application>

# Command to run the application
CMD ["node", "yourapplication.js"]
```
# docker-compose.yml file for all the images
1. Make sure you specify the ports correct
2. Make sure you specify the volumes correctly specified
```bash
 version: '3'

volumes:
  <external_logs>:

services:
  <application name>:
    container_name: <container name>
    build: 
      context: ./<application_name>
      dockerfile: Dockerfile
    ports:
      - "<port number>:<port number>"
    volumes:
      - '/var/lib/docker:/var/lib/docker'
      - '<external_logs>:/app'
    logging:
      driver: loki
      options:
        loki-url: "http://<your ip address>:3100/loki/api/v1/push"
    networks:
      - monitoring
  
  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/tmp:/var/lib/grafana
      - ./grafana/tmp/grafana.ini:/etc/grafana/grafana.ini
    networks:
      - monitoring

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - loki

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - "/var/log:/var/log"
      - "external_logs:/external_logs"
      - "./positions.yaml:/tmp/positions.yaml"
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./promtail-config.yml:/etc/promtail-config.yml"
    command: "-config.file=/etc/promtail-config.yml"

    networks:
      - loki

  
  
networks:
  loki:
    driver: bridge
  monitoring:
    driver: bridge
```
# configure the promtail-config.yml file
Promtail is an agent which tails log files and pushes them to Loki.
```bash
 positions:
  filename: ./positions.yaml
clients:
  - url: http://<your ip address>:3100/loki/api/v1/push
scrape_configs:
  - job_name: <your_application_logs>
    static_configs:
      - targets:
          - localhost
        labels:
          job: blog_logs
          __path__: /<your_application_logs>/<external_log_files>.txt
    pipeline_stages:
      - regex:
          expression: '^(?P<timestamp>\S+)\s+->\s+(?P<message>.*)$'

```
positions.yaml
1. The positions file helps Promtail continue reading from where it left off in the case of the Promtail instance restarting.
```bash
positions:
  /<yourapp>_logs/<external log file>.txt: "0"
  ```

# visualization for count of status codes in grafana

Middleware for Logging Status Code and Response Time

This middleware logs the status code and response time of HTTP requests. It records the start time of request processing and captures the response details once the response is sent.


```bash

app.use((req, res, next) => {
  const startTime = Date.now(); // Start time when request is received

  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime; // Elapsed time between request and response
    const statusCode = res.statusCode; // Status code of the response
    const logMessage = `${req.method} ${req.url} responded with status ${statusCode} in ${elapsedTime} ms`;
    logToFile(logMessage,"external_file.txt");
  });

  next();
});
```
Then in Grafana for Loki as the data source perform LogQL query given as
If you donot want to specify the middleware then return the status code for each response

```bash
count_over_time({job="cred_logs"} |= `status 502` [24h])
```
And use the time-series to view the different graphs for the the requests that returned 502 status code.

# Setting email alerts in Grafana
1. Create a grafana.ini file
2. configure your free smtp server
```bash
[paths]
data = /var/lib/grafana/data
logs = /var/log/grafana
plugins = /var/lib/grafana/plugins
[server]
http_port = 3000

[smtp]
enabled = true
host = smtp.mailosaur.net:587
user = 
# If the password contains # or ; you have to wrap it with triple quotes. Ex """#password;"""
password = 
cert_file =
key_file =
skip_verify = true
from_address = 
from_name = Grafana
ehlo_identity =
startTLS_policy =
```
3. enter the user,password and from_address.
4. create the contact point in grafana in alerting section using the mail addresss and test the mail to check if the mails are being sent.
5. Now in the dashboard give the alert condition








"# grafana-loki1" 

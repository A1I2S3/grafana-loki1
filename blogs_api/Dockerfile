# Use the official Node.js image as a base
FROM node:16-alpine3.12

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 6000

# Command to run the application
CMD ["node", "blogs.js"]

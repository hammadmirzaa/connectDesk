# Use official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend code into the container
COPY . .

# Expose the port the app runs on (React default is 3000)
EXPOSE 3000

# Command to start the frontend application
CMD ["npm", "start"]

# Use Node.js official image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (if needed)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]

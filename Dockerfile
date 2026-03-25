# Step 1: Use Node base image
FROM node:18

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all project files
COPY . .

# Step 6: Expose port
EXPOSE 5002

# Step 7: Start app
CMD ["npm", "run", "dev"]
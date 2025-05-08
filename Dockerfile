#Step 1: Use Node.js image
FROM node:18
#Step 2: Set working directory
WORKDIR /app
#Step 3: Copy packages file and install dependencies
COPY package*.json ./
RUN npm install
#Step 4: Copy source code
COPY . .
#Step 5: Expose port
EXPOSE 3000
#Step 6: Run the app
CMD ["node", "index.js"]

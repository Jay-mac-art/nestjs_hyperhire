### Base Node APP#
FROM node:18.14.0-alpine

### Create app directory
WORKDIR /app

### Copy the package.json file to Container 
COPY package*.json ./

#RUN npm update
RUN rm -rf node_modules
RUN rm -rf ~/.npm
RUN npm i

### Copy entire Source Code Local to Container
COPY . .

### Creates a "dist" folder with the production build
RUN npm run build

### Set NODE_ENV environment variable
ENV NODE_ENV production

### Expose the APP in Below Port
EXPOSE 5000

### Start the server using the production build
CMD ["sh", "-c", "node dist/main.js"]

FROM node:22.15.0 AS builder

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get -y install build-essential \
        wget

RUN cd /usr/src \
    && wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz \
    && tar -xzf Python-3.11.0.tgz \
    && cd Python-3.11.0 \
    && ./configure --enable-optimizations \
    && make altinstall

RUN update-alternatives --install /usr/bin/python python /usr/local/bin/python3.11 1

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn run build

# Use a smaller base image for the final production build
FROM node:22.15.0 AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the production dependencies and compiled app from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
RUN yarn install --only=production
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000
# Start the NestJS app
CMD ["node", "dist/main"]



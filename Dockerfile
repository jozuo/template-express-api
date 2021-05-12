FROM node:12.14.0-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --prod
COPY . .
CMD yarn start


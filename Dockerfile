# Build the dependencies
FROM node:12-alpine AS builder

ENV NODE_ENV production

WORKDIR /build

COPY package.json .

RUN yarn --production --silent

# Build the gatsby website
FROM node:12-alpine AS build

WORKDIR /build

COPY --from=builder /build .

COPY . .

RUN yarn build

# Kintohub Static Website
FROM alpine:3 AS release

WORKDIR /app

COPY --from=build /build .

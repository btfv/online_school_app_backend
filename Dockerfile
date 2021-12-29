FROM node:14.17.3-alpine
WORKDIR /usr/src
COPY . .
RUN yarn install --pure-lockfile
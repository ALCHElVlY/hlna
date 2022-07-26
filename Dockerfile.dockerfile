# syntax=docker/dockerfile:1
FROM node:latest
ENV NODE_ENV=production

WORKDIR /etc/apps/hlna

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD [ "npm", "run", "deploy"]
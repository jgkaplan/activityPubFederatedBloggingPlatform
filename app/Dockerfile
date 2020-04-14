#node container/version
FROM node:13

#port to expose
EXPOSE 8080
EXPOSE 443
EXPOSE 80
EXPOSE 3000

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

#TODO: install caddy
#TODO: use docker compose

USER node

ENV NODE_ENV=production
CMD sapper build
CMD node __sapper__/build

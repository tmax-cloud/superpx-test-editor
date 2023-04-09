FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm install --save --legacy-peer-deps

COPY ./ ./


# Expose the listening port
EXPOSE 8080

CMD [ "npm", "run", "start" ]

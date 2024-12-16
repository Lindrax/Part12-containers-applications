
FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:8080/api

RUN npm install

RUN npm test

CMD ["npm", "run", "dev", "--", "--host"]



# This is a new stage, everything before this is gone, except for the files that we want to COPY





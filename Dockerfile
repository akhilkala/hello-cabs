FROM node:alpine as builder
WORKDIR /usr/src/app
COPY  package*.json ./
# installing only dev dependencies
RUN npm install -D
COPY . .
RUN npm run build
RUN npm run seed

FROM node:alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/package.json /usr/src/app/
RUN npm install --only=prod

CMD ["npm","start"]
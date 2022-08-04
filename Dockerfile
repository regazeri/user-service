FROM node:14.15.4-alpine 
RUN apk add --no-cache git
RUN yarn cache clean --force
# Create app directory, this is in our container/in our image
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json  yarn.lock ./
COPY tsconfig.json .

RUN yarn install --frozen-lockfile --only=production

COPY . .
COPY .env.example .
COPY ormconfig.docker.js ./ormconfig.js 

RUN yarn run build

EXPOSE 4002
CMD ["yarn" ,  "start:prod" ]
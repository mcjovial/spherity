# development stage
FROM node:16-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# production stage
FROM node:16-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN yarn --production
COPY --from=development /app/dist ./dist
CMD ["yarn", "start:prod"]

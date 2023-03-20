# development stage
FROM node:alpine AS development
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# test stage
FROM node:alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001

# production stage
FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=development /app/dist ./dist
CMD ["npm", "run", "start:prod"]

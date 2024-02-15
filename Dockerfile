FROM node:20-alpine AS builder
WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn build

FROM node:20-alpine
COPY --from=builder /app/build/ /app/build
WORKDIR /app
EXPOSE 3000
CMD ["npx", "serve", "build"]

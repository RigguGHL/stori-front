# Build Stage
FROM node:16-alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

# Run Stage
FROM nginx:1.24.0-alpine
COPY --from=builder /app/dist/stori-angular /usr/share/nginx/html
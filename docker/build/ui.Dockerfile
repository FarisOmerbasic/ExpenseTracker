FROM node:22-alpine AS build
WORKDIR /app

COPY ExpenseTracker.UI/package*.json ./
RUN npm ci

COPY ExpenseTracker.UI/ ./
RUN npm run build

FROM nginx:1.27-alpine AS final
COPY docker/build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Etapa 1: construir la aplicación
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 1. Declarar la variable de construcción para Vite
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# 2. Compilar los archivos con la variable inyectada
RUN npm run build

# Etapa 2: servir los archivos estáticos
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
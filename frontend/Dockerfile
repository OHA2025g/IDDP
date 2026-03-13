# Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./

RUN npm install --legacy-peer-deps \
 && npm install ajv@8 ajv-keywords@5 --legacy-peer-deps

COPY frontend/ .

ENV REACT_APP_BACKEND_URL=https://iddp.demo.agrayianailabs.com

RUN npm run build

# Serve build with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

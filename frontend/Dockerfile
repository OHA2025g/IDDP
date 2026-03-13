# Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy project files
COPY frontend/ .

# Backend URL for API
ENV REACT_APP_BACKEND_URL=https://iddp.demo.agrayianailabs.com

# Build React project
RUN npm run build


# Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

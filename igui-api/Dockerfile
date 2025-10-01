FROM node:18 AS base
WORKDIR /app
COPY package.json tsconfig.json jest.config.js ./
COPY src ./src
COPY tests ./tests
RUN npm install
FROM base AS test
RUN npm test
FROM node:18 AS react-build
WORKDIR /app
COPY src/ui/react-app ./react-app
WORKDIR /app/react-app
RUN npm install && npm run build
FROM node:18 AS angular-build
WORKDIR /app
COPY src/ui/angular-app ./angular-app
WORKDIR /app/angular-app
RUN npm install && npm run build -- --configuration production || true
FROM node:18-slim
WORKDIR /app
RUN npm install -g http-server
COPY --from=react-build /app/react-app/build ./react
COPY --from=angular-build /app/angular-app/dist ./angular
EXPOSE 3000 4200
CMD http-server ./react -p 3000 & http-server ./angular -p 4200

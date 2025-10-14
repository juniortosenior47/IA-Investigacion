FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY ./src ./src
CMD ["node", "src/index.ts"]

# Translator (Node.js + Express + Redis)

Summary: Express-based translator service using Redis for caching translations. TypeScript source, run with Node.js.

Quick start (Docker):
  cd translator-node-updated
  docker-compose up --build

Run locally (dev):
  npm install
  node src/index.ts

Env (.env):
  BASE_URL=http://localhost:8000
  REDIS_HOST=redis
  REDIS_PORT=6379
  REDIS_PREFIX=translator:word:

Endpoints: POST /add_words | GET /translate?word=... | POST /translate_many

Test script:
  export BASE_URL=http://localhost:8000
  node src/test_data.js

See architecture.txt for ASCII diagram.
# Word Translator Service (Python + Node.js)

This repository provides two independent implementations of a bilingual translation service using Redis as a fast cache for lookups.

Projects included:
- translator-python-poetry/ — FastAPI + Poetry + Redis (async, Python 3.11)
- translator-node-updated/ — Express + TypeScript + Redis (ioredis)

Each project is self-contained (its own Docker Compose + Redis) and exposes the same endpoints:
- POST /add_words — add or update words in the cache
- GET /translate — translate a single word
- POST /translate_many — translate multiple words at once

Quick start (choose one project to run):
Python (FastAPI + Poetry):
  cd translator-python-poetry
  docker-compose up --build

Node.js (Express + TypeScript):
  cd translator-node-updated
  docker-compose up --build

Environment variables (each project contains a .env file and docker-compose mounts it):
BASE_URL=http://localhost:8000
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PREFIX=translator:word:

Testing & verification:
Each project includes a small test script that populates sample data and verifies the endpoints:
- Python: app/test_data.py
- Node: src/test_data.js

Architecture (ASCII):
┌────────────────────────┐
│        Client          │
│  (Postman / curl / UI) │
└────────────┬───────────┘
             │ HTTP
             ▼
     ┌────────────────┐
     │   API Service   │
     │ (FastAPI / Node)│
     ├────────────────┤
     │ Endpoints:      │
     │ - /add_words    │
     │ - /translate    │
     │ - /translate_many│
     └────────┬────────┘
              │
              ▼
       ┌─────────────┐
       │    Redis     │
       │ (Cache KV)   │
       │ Key: translator:word:<term> │
       └─────────────┘


License: MIT
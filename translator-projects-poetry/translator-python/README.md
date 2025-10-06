# Translator (FastAPI + Redis + Poetry)

Summary: FastAPI-based translator service using Redis for caching translations. Managed with Poetry and targeted for Python 3.11.

Quick start (Docker):
  cd translator-python-poetry
  docker-compose up --build

Run locally (dev):
  poetry install
  poetry run uvicorn app.main:app --reload

Env (.env):
  BASE_URL=http://localhost:8000
  REDIS_HOST=redis
  REDIS_PORT=6379
  REDIS_PREFIX=translator:word:

Endpoints: POST /add_words | GET /translate?word=... | POST /translate_many

Test script:
  export BASE_URL=http://localhost:8000
  python app/test_data.py

See architecture.txt for ASCII diagram.
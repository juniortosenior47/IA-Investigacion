# Translator Python Updated (FastAPI async + Lifespan + Redis)

This project provides an async FastAPI-based translator service with Redis as a shared cache.
Features:
- Uses FastAPI lifespan handlers (no deprecated on_event)
- Async Redis client (redis.asyncio)
- Configurable Redis key prefix via REDIS_PREFIX
- Endpoints: GET /translate, POST /translate_many, POST /add_words
- Docker + docker-compose to run service + redis

## Structure
```
translator-python-updated/
├── app/
│   ├── main.py
│   ├── __init__.py
│   └── test_data.py   ← 🧪 script de prueba
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md

```
## Ejecutar pruebas

docker-compose up -d
python app/test_data.py


## Run
```bash
docker-compose up --build
```

Service: http://localhost:8000
Docs (Swagger): http://localhost:8000/docs

## Env variables (docker-compose already sets defaults)
- REDIS_HOST (default: redis)
- REDIS_PORT (default: 6379)
- REDIS_PREFIX (default: translator:word:)

## Endpoints examples

### Translate one word
```bash
curl "http://localhost:8000/translate?word=perro"
```

### Translate many words (POST)
```bash
curl -X POST http://localhost:8000/translate_many \
  -H "Content-Type: application/json" \
  -d '["perro", "gato", "árbol"]'
```

### Add many words (batch) - POST
```bash
curl -X POST http://localhost:8000/add_words \
  -H "Content-Type: application/json" \
  -d '[{"word":"gato","translation":"cat"},{"word":"árbol","translation":"tree"}]'
```

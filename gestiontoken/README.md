# nest-idcs-redis

Proyecto ejemplo NestJS para administrar Oracle IDCS con almacenamiento de tokens en Redis.


## Añadidos en esta versión


- Endpoints CRUD de usuarios (create/update/delete/list).
- Guard API Key simple para protección de endpoints administrativos.
- .env.example con variables recomendadas.
- Auditoría básica (logs) en IdcsService.
- docker-compose con ejemplo de secrets.

## Uso rápido

1. Copia `.env.example` a `.env` y rellena valores reales (IDCS credentials, API key).
2. Levanta con `docker-compose up --build` (o con `npm start` en local).
3. Endpoints administrativos protegidos: env var `API_KEY_MANAGEMENT`.

# Translator Node Updated (Express + TypeScript + Redis)

Features:
- Prefix-configurable Redis keys (REDIS_PREFIX)
- Endpoints: GET /translate, POST /translate_many, POST /add_words
- Uses ioredis, pipeline for batch sets, mget for batch gets
- Docker + docker-compose to run service + redis

## Structure
```
translator-node-updated/
├── src/
│   ├── index.ts
│   ├── cache.ts
│   └── test_data.js   ← 🧪 script de prueba
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Ejecutar pruebas

docker-compose up -d
node src/test_data.js


## Run
```bash
docker-compose up --build
```

Service: http://localhost:3000

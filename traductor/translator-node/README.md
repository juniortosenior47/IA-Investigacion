# Translator Node (Express + TypeScript + Redis)

## Ejecutar
```bash
docker-compose up --build
```

API: http://localhost:3000/translate?word=hola


---

# 📘 README.md (Node.js + Express + TypeScript)

```markdown
# Traductor Español ↔ Inglés (Express + Redis)

Este proyecto implementa una API de traducción usando **Express (TypeScript)** y **Redis** como caché en memoria.

---

## 📂 Estructura de Carpetas

translator-node/
│── src/
│ ├── index.ts # Entrypoint de la API
│ ├── cache.ts # Conexión a Redis
│── package.json # Dependencias Node.js
│── tsconfig.json # Configuración TypeScript
│── Dockerfile # Imagen Docker de la API
│── docker-compose.yml # Orquestación API + Redi


---

## 🚀 Levantar el Proyecto

1. Clonar el repositorio y entrar a la carpeta:
   ```bash
   cd translator-node

2. Levantar con Docker Compose:

    docker-compose up --build

3. La API estará disponible en:

    http://localhost:3000
    
## Endpoints

1. Traducir una palabra

    curl "http://localhost:3000/translate?word=perro"

    Respuesta:

    {
        "input": "perro",
        "translation": "dog"
    }


2. Agregar lista de palabras

   curl -X POST http://localhost:3000/add_words \
  -H "Content-Type: application/json" \
  -d '[
    {"word": "gato", "translation": "cat"},
    {"word": "árbol", "translation": "tree"}
  ]'

    Respuesta:

    {
        "message": "Palabras agregadas",
        "data": [
            {"gato": "cat"},
            {"árbol": "tree"}
        ]
    }


3. Traducir varias palabras

curl -X POST http://localhost:3000/translate_many \
  -H "Content-Type: application/json" \
  -d '["perro", "gato", "árbol"]'

    Respuesta:

    {
        "translations": {
            "perro": "dog",
            "gato": "cat",
            "árbol": "tree"
        }
    }



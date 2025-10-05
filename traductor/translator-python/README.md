# Traductor Español ↔ Inglés (FastAPI + Redis)

Este proyecto implementa una API de traducción usando **FastAPI** y **Redis** como caché en memoria.

---

## 📂 Estructura de Carpetas

translator-python/
│── app/
│ ├── main.py # Entrypoint de la API
│ ├── redis_client.py # Conexión a Redis
│ └── init.py
│── requirements.txt # Dependencias de Python
│── Dockerfile # Imagen Docker de la API
│── docker-compose.yml # Orquestación API + Redis
---

## 🚀 Levantar el Proyecto

1. Clonar el repositorio y entrar a la carpeta:
   ```bash
   cd translator-python

2. Levantar con Docker Compose:
    docker-compose up --build

3. La API estará disponible en:
    http://localhost:8000

4. Documentación automática (Swagger):
    http://localhost:8000/docs

## Endpoints

1. Traducir una palabra

    curl "http://localhost:8000/translate?word=perro"

   Respuesta
    {
        "input": "perro",
        "translation": "dog"
    }

2. Agregar lista de palabras

   curl -X POST http://localhost:8000/add_words \
  -H "Content-Type: application/json" \
  -d '[
    {"word": "gato", "translation": "cat"},
    {"word": "árbol", "translation": "tree"}
  ]'

    Respuesta

    {
        "message": "Palabras agregadas",
        "data": [
            {"gato": "cat"},
            {"árbol": "tree"}
        ]
    }

3. Traducir varias palabras

    curl -X POST http://localhost:8000/translate_many \
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



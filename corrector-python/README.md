# 🧠 FastAPI Text Corrector (fastapi-text-corrector)

API REST que detecta y elimina palabras sobrantes en frases en inglés,
por ejemplo artículos innecesarios (*the*, *a*, *an*) antes de plurales.

## Estructura
```
fastapi-text-corrector/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── text_cleaner.py
│   │
│   ├── __init__.py
│   └── main.py
├── .env
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Cómo ejecutar (local)
Recomendado: usar Poetry (Python 3.11).

```bash
# instalar dependencias
poetry install

# descargar el modelo de spaCy
poetry run python -m spacy download en_core_web_sm

# ejecutar la app
poetry run uvicorn app.main:app --reload
```

## Con Docker
```bash
docker-compose up --build
```

## Endpoint
**POST** `/api/correct`

Body:
```json
{ "text": "In linguistics, morphology is the study of the words." }
```

Response:
```json
{
  "original": "In linguistics, morphology is the study of the words.",
  "corrected": "In linguistics, morphology is the study of words."
}
```


FROM python:3.11-slim

WORKDIR /app

# Evitar prompts y reducir tamaño
ENV POETRY_VIRTUALENVS_CREATE=false         POETRY_NO_INTERACTION=1         PYTHONDONTWRITEBYTECODE=1         PYTHONUNBUFFERED=1

# Instalar system deps (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential         && rm -rf /var/lib/apt/lists/*

# Instalar Poetry
RUN pip install --no-cache-dir poetry

# Copiar pyproject y lock (if present) y luego instalar dependencias
COPY pyproject.toml poetry.lock* /app/
RUN poetry install --no-root --no-interaction --no-ansi

# Descargar modelo de spaCy
RUN poetry run python -m spacy download en_core_web_sm

# Copiar la app
COPY . /app

EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

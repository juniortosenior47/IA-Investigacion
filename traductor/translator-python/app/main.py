from fastapi import FastAPI, Query, Body
from .redis_client import redis_client
from typing import List, Dict

app = FastAPI(title="Traductor Español ↔ Inglés con Redis")

@app.get("/translate")
def translate(word: str = Query(...)):
    word = word.lower().strip()
    translation = redis_client.get(word)
    return {"input": word, "translation": translation or "No encontrado"}

@app.post("/translate_many")
def translate_many(words: List[str] = Body(...)):
    normalized = [w.lower().strip() for w in words]
    translations = redis_client.mget(normalized)

    results = {}
    for i, word in enumerate(normalized):
        results[word] = translations[i] if translations[i] else "No encontrado"

    return {"translations": results}

@app.post("/translate_many_no_eficient")
def translate_manyno_eficient(words: List[str] = Body(...)):
    results = {}
    for word in words:
        normalized = word.lower().strip()
        translation = redis_client.get(normalized)
        results[normalized] = translation or "No encontrado"
    return {"translations": results}

@app.post("/add_word")
def add_word(
    word: str = Body(..., embed=True),
    translation: str = Body(..., embed=True)
):
    word = word.lower().strip()
    redis_client.set(word, translation)
    return {"message": f"Palabra '{word}' agregada con traducción '{translation}'"}

@app.post("/add_words")
def add_words(words: List[Dict[str, str]] = Body(...)):
    added = []
    for entry in words:
        word = entry["word"].lower().strip()
        translation = entry["translation"]
        redis_client.set(word, translation)
        added.append({word: translation})
    return {"message": "Palabras agregadas", "data": added}
import aioredis
from fastapi import FastAPI, Body
from typing import List, Dict

app = FastAPI(title="Traductor Async")

PREFIX = "translator:word:"
redis = None

@app.on_event("startup")
async def startup():
    global redis
    redis = await aioredis.from_url("redis://redis:6379", decode_responses=True)

@app.post("/add_words")
async def add_words(words: List[Dict[str, str]] = Body(...)):
    async with redis.pipeline(transaction=False) as pipe:
        for entry in words:
            key = f"{PREFIX}{entry['word'].lower().strip()}"
            pipe.set(key, entry["translation"])
        await pipe.execute()
    return {"message": "Palabras agregadas"}

@app.post("/translate_many")
async def translate_many(words: List[str] = Body(...)):
    keys = [f"{PREFIX}{w.lower().strip()}" for w in words]
    translations = await redis.mget(*keys)
    return {
        "translations": {
            w: translations[i] or "No encontrado" for i, w in enumerate(words)
        }
    }

from fastapi import FastAPI, Query, Body, HTTPException
from contextlib import asynccontextmanager
from typing import List, Dict, Optional
import os
import redis.asyncio as aioredis

# Config via env
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PREFIX = os.getenv("REDIS_PREFIX", "translator:word:")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # initialize async redis client
    app.state.redis = await aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}", decode_responses=True)
    # optional: preload some initial data if not present (idempotent)
    initial = {
        "hola": "hello",
        "cómo estás": "how are you",
        "perro": "dog",
        "casa": "house"
    }
    # use pipeline to set if missing
    pipe = app.state.redis.pipeline(transaction=False)
    for k, v in initial.items():
        key = f"{REDIS_PREFIX}{k}"
        pipe.setnx(key, v)
    await pipe.execute()

    yield

    await app.state.redis.close()

app = FastAPI(title="Translator Async FastAPI", lifespan=lifespan)

def _key(word: str, prefix: Optional[str] = None) -> str:
    p = prefix if prefix is not None else REDIS_PREFIX
    return f"{p}{word}"

@app.get("/translate")
async def translate(word: str = Query(..., min_length=1), prefix: Optional[str] = Query(None)):
    normalized = word.lower().strip()
    p = prefix if prefix is not None else REDIS_PREFIX
    key = _key(normalized, p)
    translation = await app.state.redis.get(key)
    return {"input": normalized, "translation": translation or "No encontrado"}

@app.post("/add_words")
async def add_words(words: List[Dict[str, str]] = Body(...), prefix: Optional[str] = Query(None)):
    if not isinstance(words, list) or not words:
        raise HTTPException(status_code=400, detail="Se requiere una lista no vacía de objetos {word, translation}")
    p = prefix if prefix is not None else REDIS_PREFIX
    pipe = app.state.redis.pipeline(transaction=False)
    added = []
    for entry in words:
        w = entry.get("word")
        t = entry.get("translation")
        if not w or t is None:
            continue
        normalized = w.lower().strip()
        key = _key(normalized, p)
        pipe.set(key, t)
        added.append({normalized: t})
    await pipe.execute()
    return {"message": "Palabras agregadas", "data": added}

@app.post("/translate_many")
async def translate_many(words: List[str] = Body(...), prefix: Optional[str] = Query(None)):
    if not isinstance(words, list) or not words:
        raise HTTPException(status_code=400, detail="Se requiere una lista no vacía de palabras")
    p = prefix if prefix is not None else REDIS_PREFIX
    normalized = [w.lower().strip() for w in words]
    keys = [ _key(w, p) for w in normalized ]
    # mget accepts *keys
    translations = await app.state.redis.mget(*keys)
    result = { normalized[i]: translations[i] or "No encontrado" for i in range(len(normalized)) }
    return {"translations": result}

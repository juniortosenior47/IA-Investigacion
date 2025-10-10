from fastapi import FastAPI, Query, Body, HTTPException
from contextlib import asynccontextmanager
from typing import List, Dict, Optional
import os
import redis.asyncio as aioredis
from app.services.ordenar import sort_and_translate
from app.services.text_cleaner import clean_sentence

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PREFIX = os.getenv("REDIS_PREFIX", "translator:word:")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = await aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}", decode_responses=True)
    initial = {"hola": "hello", "perro": "dog", "casa": "house"}
    pipe = app.state.redis.pipeline(transaction=False)
    for k, v in initial.items():
        pipe.setnx(f"{REDIS_PREFIX}{k}", v)
    await pipe.execute()
    yield
    await app.state.redis.close()

app = FastAPI(title="Word Translator API", lifespan=lifespan)

def _key(word: str, prefix: Optional[str] = None) -> str:
    return f"{prefix or REDIS_PREFIX}{word}"

@app.get("/translate")
async def translate(word: str = Query(...), prefix: Optional[str] = Query(None)):
    key = _key(word.lower(), prefix)
    result = await app.state.redis.get(key)
    return {"word": word, "translation": result or "No encontrado"}

@app.post("/add_words")
async def add_words(words: List[Dict[str, str]] = Body(...), prefix: Optional[str] = Query(None)):
    if not words:
        raise HTTPException(status_code=400, detail="Lista vacía")
    pipe = app.state.redis.pipeline(transaction=False)
    for w in words:
        pipe.set(_key(w["word"].lower(), prefix), w["translation"])
    await pipe.execute()
    return {"message": "Palabras agregadas", "count": len(words)}

@app.post("/translate_many")
async def translate_many(words: List[str] = Body(...), prefix: Optional[str] = Query(None)):
    if not words:
        raise HTTPException(status_code=400, detail="Lista vacía")
    keys = [_key(w.lower(), prefix) for w in words]
    results = await app.state.redis.mget(*keys)

    dicc_ordenado, frase_final = sort_and_translate(results, words)
    
    ##translations = {w: r or "No encontrado" for w, r in zip(words, results)}
    return {"diccionary": dicc_ordenado, "phrase": clean_sentence(frase_final)}
    

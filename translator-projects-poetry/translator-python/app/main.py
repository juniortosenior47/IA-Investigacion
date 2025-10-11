from fastapi import FastAPI
from contextlib import asynccontextmanager
import os

# Infrastructure imports
from app.infrastructure.adapters.redis_cache_adapter import RedisClient
from app.infrastructure.adapters.fastapi_adapter import create_fastapi_app

# Domain imports
from app.domain.services.translation_service import TranslationService
from app.domain.ports.cache_port import CachePort

REDIS_PREFIX = os.getenv("REDIS_PREFIX", "translator:word:")

# Dependency instances
redis_cache_adapter = RedisClient()
translation_service = TranslationService(cache_port=redis_cache_adapter)

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    await redis_cache_adapter.connect()
    
    initial_words = {"hola": "hello", "perro": "dog", "casa": "house"}
    for k, v in initial_words.items():
        # Use setnx directly on the adapter instance
        await redis_cache_adapter.setnx(k, v, prefix=REDIS_PREFIX) 

    yield
    await redis_cache_adapter.close()

app = create_fastapi_app(translation_service) # Pass the service to the adapter
app.router.lifespan_context = lifespan
    

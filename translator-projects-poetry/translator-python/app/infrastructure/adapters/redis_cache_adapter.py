import os
import redis.asyncio as aioredis
from typing import Optional, List
from app.domain.ports.cache_port import CachePort


class RedisClient(CachePort):
    def __init__(self):
        self.REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
        self.REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
        self.REDIS_PREFIX = os.getenv("REDIS_PREFIX", "translator:word:")
        self.client: Optional[aioredis.Redis] = None

    async def connect(self):
        self.client = await aioredis.from_url(f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}", decode_responses=True)

    async def close(self):
        if self.client:
            await self.client.close()

    def _key(self, word: str, prefix: Optional[str] = None) -> str:
        return f"{prefix or self.REDIS_PREFIX}{word}"

    async def get(self, word: str, prefix: Optional[str] = None) -> Optional[str]:
        if not self.client:
            raise ConnectionError("Redis client not connected.")
        key = self._key(word.lower(), prefix)
        return await self.client.get(key)

    async def set(self, word: str, translation: str, prefix: Optional[str] = None):
        if not self.client:
            raise ConnectionError("Redis client not connected.")
        key = self._key(word.lower(), prefix)
        await self.client.set(key, translation)

    async def setnx(self, word: str, translation: str, prefix: Optional[str] = None) -> bool:
        if not self.client:
            raise ConnectionError("Redis client not connected.")
        key = self._key(word.lower(), prefix)
        return await self.client.setnx(key, translation)

    async def mget(self, words: List[str], prefix: Optional[str] = None) -> List[Optional[str]]:
        if not self.client:
            raise ConnectionError("Redis client not connected.")
        keys = [self._key(w.lower(), prefix) for w in words]
        return await self.client.mget(*keys)

    async def pipeline(self, transaction: bool = False):
        if not self.client:
            raise ConnectionError("Redis client not connected.")
        return self.client.pipeline(transaction=transaction)

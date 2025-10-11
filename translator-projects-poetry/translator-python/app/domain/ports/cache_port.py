from abc import ABC, abstractmethod
from typing import List, Optional

class CachePort(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def close(self):
        pass

    @abstractmethod
    async def get(self, word: str, prefix: Optional[str] = None) -> Optional[str]:
        pass

    @abstractmethod
    async def set(self, word: str, translation: str, prefix: Optional[str] = None):
        pass

    @abstractmethod
    async def setnx(self, word: str, translation: str, prefix: Optional[str] = None) -> bool:
        pass

    @abstractmethod
    async def mget(self, words: List[str], prefix: Optional[str] = None) -> List[Optional[str]]:
        pass

    @abstractmethod
    async def pipeline(self, transaction: bool = False):
        # In a real scenario, pipeline might return a specific type of pipeline object
        # For now, we'll keep it general.
        pass

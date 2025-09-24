import abc
import uuid
from typing import List, Optional
from .entities import SetOfWord

class AbstractSetOfWordsRepository(abc.ABC):
    @abc.abstractmethod
    async def create(self, sow: SetOfWord) -> SetOfWord: ...

    @abc.abstractmethod
    async def get_by_id(self, id: uuid.UUID) -> Optional[SetOfWord]: ...

    @abc.abstractmethod
    async def list(self, limit: int = 100, offset: int = 0) -> List[SetOfWord]: ...

    @abc.abstractmethod
    async def update(self, id: uuid.UUID, data: dict) -> Optional[SetOfWord]: ...

    @abc.abstractmethod
    async def delete(self, id: uuid.UUID) -> bool: ...

    @abc.abstractmethod
    async def get_by_spanish_list(self, words: List[str]) -> List[SetOfWord]: ...

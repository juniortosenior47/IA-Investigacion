from abc import ABC, abstractmethod
from typing import List, Dict, Tuple, Optional

class TranslationServicePort(ABC):
    @abstractmethod
    async def translate_word(self, word: str, prefix: Optional[str] = None) -> Optional[str]:
        pass

    @abstractmethod
    async def add_words(self, words: List[Dict[str, str]], prefix: Optional[str] = None) -> int:
        pass

    @abstractmethod
    async def translate_many_words(self, words: List[str], prefix: Optional[str] = None) -> Tuple[Dict[str, str], str]:
        pass

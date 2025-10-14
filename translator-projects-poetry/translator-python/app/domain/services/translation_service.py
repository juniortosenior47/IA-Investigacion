from typing import List, Dict, Tuple, Optional
from app.domain.ports.cache_port import CachePort
from app.domain.ports.translation_service_port import TranslationServicePort
from app.domain.services.ordenar import sort_and_translate
from app.domain.services.correct_sentence import correct_sentence

class TranslationService(TranslationServicePort):
    def __init__(self, cache_port: CachePort):
        self.cache_port = cache_port

    async def translate_word(self, word: str, prefix: Optional[str] = None) -> Optional[str]:
        return await self.cache_port.get(word, prefix)

    async def add_words(self, words: List[Dict[str, str]], prefix: Optional[str] = None) -> int:
        if not words:
            return 0
        
        pipe = await self.cache_port.pipeline(transaction=False)
        for w in words:
            await self.cache_port.set(w["word"].lower(), w["translation"], prefix)
        # It's important to execute the pipeline. The current RedisClient.set doesn't use it directly.
        # This will be refactored to use the pipeline more effectively if needed.
        # For now, each set is an individual operation within the context of the service.
        return len(words)

    async def translate_many_words(self, words: List[str], prefix: Optional[str] = None) -> Tuple[Dict[str, str], str]:
        if not words:
            return {}, ""
        
        results = await self.cache_port.mget(words, prefix)
        dicc_ordenado, frase_final = sort_and_translate(results, words)
        ##return dicc_ordenado, correct_sentence(clean_sentence(frase_final))
        return dicc_ordenado, correct_sentence(frase_final)

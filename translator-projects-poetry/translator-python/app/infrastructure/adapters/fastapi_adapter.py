from fastapi import FastAPI, Query, Body, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
from app.domain.ports.translation_service_port import TranslationServicePort


def get_translation_service(translation_service: TranslationServicePort = Depends()) -> TranslationServicePort:
    return translation_service


def create_fastapi_app(translation_service: TranslationServicePort) -> FastAPI:
    app = FastAPI(title="Word Translator API")

    # CORS Configuration
    origins = [
        "http://localhost:5173",
        "http://localhost:80"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/translate")
    async def translate(word: str = Query(...), prefix: Optional[str] = Query(None)):
        result = await translation_service.translate_word(word, prefix)
        if not result:
            raise HTTPException(status_code=404, detail=f"Translation for '{word}' not found")
        return {"word": word, "translation": result}

    @app.post("/add_words")
    async def add_words(words: List[Dict[str, str]] = Body(...), prefix: Optional[str] = Query(None)):
        if not words:
            raise HTTPException(status_code=400, detail="Lista vacía")
        count = await translation_service.add_words(words, prefix)
        return {"message": "Palabras agregadas", "count": count}

    @app.post("/translate_many")
    async def translate_many(words: List[str] = Body(...), prefix: Optional[str] = Query(None)):
        if not words:
            raise HTTPException(status_code=400, detail="Lista vacía")
        dicc_ordenado, frase_final = await translation_service.translate_many_words(words, prefix)
        return {"diccionary": dicc_ordenado, "phrase": frase_final}

    return app

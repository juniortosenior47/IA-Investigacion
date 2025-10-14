from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.text_cleaner import clean_sentence

router = APIRouter()

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Texto en inglés a corregir")

class TextResponse(BaseModel):
    original: str
    corrected: str

@router.post("/correct", response_model=TextResponse)
async def correct_text(request: TextRequest):
    """Recibe un texto y devuelve la versión corregida (artículos sobrantes eliminados)."""
    try:
        corrected = clean_sentence(request.text)
        return {"original": request.text, "corrected": corrected}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

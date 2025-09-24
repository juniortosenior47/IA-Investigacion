from fastapi import APIRouter, Depends, HTTPException
from typing import List
import uuid
from ...schemas import SetOfWordCreate, SetOfWordUpdate, SetOfWordRead, BulkSpanishRequest
from ...domain.ports import AbstractSetOfWordsRepository
from ...deps import get_set_of_words_repository

router = APIRouter(prefix="/words", tags=["set_of_words"])

@router.post("/", response_model=SetOfWordRead)
async def create_word(data: SetOfWordCreate, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    return await repo.create(data)

@router.get("/{id}", response_model=SetOfWordRead)
async def get_word(id: uuid.UUID, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    obj = await repo.get_by_id(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Word not found")
    return obj

@router.get("/", response_model=List[SetOfWordRead])
async def list_words(limit: int = 100, offset: int = 0, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    return await repo.list(limit, offset)

@router.put("/{id}", response_model=SetOfWordRead)
async def update_word(id: uuid.UUID, data: SetOfWordUpdate, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    obj = await repo.update(id, data.dict(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Word not found")
    return obj

@router.delete("/{id}")
async def delete_word(id: uuid.UUID, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    ok = await repo.delete(id)
    if not ok:
        raise HTTPException(status_code=404, detail="Word not found")
    return {"deleted": True}

@router.post("/bulk-by-spanish", response_model=List[SetOfWordRead])
async def bulk_by_spanish(req: BulkSpanishRequest, repo: AbstractSetOfWordsRepository = Depends(get_set_of_words_repository)):
    return await repo.get_by_spanish_list(req.words)

from .db import get_session
from .adapters.repository.postgres_repository import PostgresSetOfWordsRepository
from fastapi import  Depends

async def get_set_of_words_repository(session=Depends(get_session)):
    return PostgresSetOfWordsRepository(session)

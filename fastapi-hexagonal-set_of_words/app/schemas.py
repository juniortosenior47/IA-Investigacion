from pydantic import BaseModel
from typing import Optional, List
import uuid

class SetOfWordBase(BaseModel):
    spanish: str
    english: Optional[str] = None
    grammatical_categories: Optional[str] = None
    is_published: Optional[bool] = True

class SetOfWordCreate(SetOfWordBase):
    pass

class SetOfWordUpdate(SetOfWordBase):
    pass

class SetOfWordRead(SetOfWordBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

class BulkSpanishRequest(BaseModel):
    words: List[str]

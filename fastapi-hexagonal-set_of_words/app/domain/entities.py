from dataclasses import dataclass
import uuid

@dataclass
class SetOfWord:
    id: uuid.UUID
    spanish: str
    english: str | None
    grammatical_categories: str | None
    is_published: bool

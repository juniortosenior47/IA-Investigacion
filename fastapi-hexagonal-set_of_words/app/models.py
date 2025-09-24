from sqlalchemy import Column, String, Boolean, TIMESTAMP, func
import uuid
from sqlalchemy.dialects.postgresql import UUID
from .db import Base

class SetOfWord(Base):
    __tablename__ = "set_of_words"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    spanish = Column(String, nullable=False, index=True)
    english = Column(String, nullable=True)
    grammatical_categories = Column(String, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

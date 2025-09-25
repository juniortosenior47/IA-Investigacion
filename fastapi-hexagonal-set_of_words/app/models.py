from sqlalchemy import Column, String, Boolean, text, DateTime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from .db import Base

class SetOfWord(Base):
    __tablename__ = "set_of_words"
    __table_args__ = {"schema": "public"}

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    spanish = Column(String, nullable=False)
    english = Column(String, nullable=True)
    grammatical_categories = Column(String, nullable=True)
    is_published = Column(Boolean, nullable=True, server_default=text("true"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

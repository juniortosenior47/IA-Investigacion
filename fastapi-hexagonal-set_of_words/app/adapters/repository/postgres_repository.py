from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from ...models import SetOfWord
from ...domain.entities import SetOfWord as SowEntity
from ...domain.ports import AbstractSetOfWordsRepository


class PostgresSetOfWordsRepository(AbstractSetOfWordsRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, sow: SowEntity) -> SowEntity:
        db_obj = SetOfWord(
            spanish=sow.spanish,
            english=sow.english,
            grammatical_categories=sow.grammatical_categories,
            is_published=sow.is_published,
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return SowEntity(db_obj.__dict__)

    async def get_by_id(self, id: uuid.UUID):
        result = await self.session.execute(select(SetOfWord).where(SetOfWord.id == id))
        obj = result.scalar_one_or_none()
        return SowEntity(obj.__dict__) if obj else None

    async def list(self, limit: int = 100, offset: int = 0):
        result = await self.session.execute(
            select(SetOfWord).offset(offset).limit(limit)
        )
        objs = result.scalars().all()
        return [
            SowEntity(
                id=o.id,
                spanish=o.spanish,
                english=o.english,
                grammatical_categories=o.grammatical_categories,
                is_published=o.is_published,
            )
            for o in objs
        ]

    async def update(self, id: uuid.UUID, data: dict):
        result = await self.session.execute(select(SetOfWord).where(SetOfWord.id == id))
        obj = result.scalar_one_or_none()
        if not obj:
            return None
        for k, v in data.items():
            setattr(obj, k, v)
        await self.session.commit()
        await self.session.refresh(obj)
        return SowEntity(obj.__dict__)

    async def delete(self, id: uuid.UUID) -> bool:
        result = await self.session.execute(select(SetOfWord).where(SetOfWord.id == id))
        obj = result.scalar_one_or_none()
        if not obj:
            return False
        await self.session.delete(obj)
        await self.session.commit()
        return True

    async def get_by_spanish_list(self, words: List[str]):
        result = await self.session.execute(
            select(SetOfWord).where(SetOfWord.spanish.in_(words))
        )
        objs = result.scalars().all()
        return [
            SowEntity(
                id=o.id,
                spanish=o.spanish,
                english=o.english,
                grammatical_categories=o.grammatical_categories,
                is_published=o.is_published,
            )
            for o in objs
        ]

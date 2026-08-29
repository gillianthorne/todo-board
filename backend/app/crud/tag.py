from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate

def create_tag(db: Session, tag_in: TagCreate) -> Tag:
    new_tag = Tag(tag_name=tag_in.tag_name, colour=tag_in.colour)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

def get_tags(db: Session) -> list[Tag]:
    tags = db.execute(select(Tag)).scalars().all()
    return tags

def get_tag(db: Session, tag_id: int) -> Tag | None:
    tag = db.get(Tag, tag_id)
    return tag

def update_tag(db: Session, tag: Tag, tag_in: TagUpdate) -> Tag:
    updated_fields = tag_in.model_dump(exclude_unset=True)

    for key, value in updated_fields.items():
        setattr(tag, key, value)

    db.commit()
    db.refresh(tag)
    return tag

def delete_tag(db: Session, tag: Tag) -> None:
    db.delete(tag)
    db.commit()
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.tag import TagCreate, TagRead, TagUpdate
from app.crud.tag import create_tag, delete_tag, get_tag, get_tags, update_tag
from app.deps import require_auth
from app.database import get_db
from app.models.tag import Tag


router = APIRouter(prefix="/tags", dependencies=[Depends(require_auth)])

def get_tag_or_404(tag_id: int, db: Session = Depends(get_db)):
    tag = get_tag(db, tag_id)
    if tag is None:
        raise HTTPException(404, detail="Tag not found")
    return tag

@router.post("", response_model=TagRead, status_code=201)
def create_tag_route(tag_in: TagCreate, db: Session = Depends(get_db)):
    return create_tag(db, tag_in)

@router.get("", response_model=list[TagRead])
def get_all_tags_route(db: Session = Depends(get_db)):
    return get_tags(db)

@router.get("/{tag_id}", response_model=TagRead)
def get_tag_route(tag: Tag = Depends(get_tag_or_404)):
    return tag

@router.patch("/{tag_id}", response_model=TagRead)
def update_tag_route(tag_in: TagUpdate, tag: Tag = Depends(get_tag_or_404), db: Session = Depends(get_db)):
    return update_tag(db, tag, tag_in)

@router.delete("/{tag_id}", status_code=204)
def delete_tag_route(tag: Tag = Depends(get_tag_or_404), db: Session = Depends(get_db)):
    delete_tag(db, tag)


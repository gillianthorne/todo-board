from typing import Optional
from pydantic import BaseModel

class TagCreate(BaseModel):
    tag_name: str
    colour: Optional[str] = None

class TagUpdate(BaseModel):
    tag_name: Optional[str] = None
    colour: Optional[str] = None

class TagRead(BaseModel):
    id: int
    tag_name: str
    colour: Optional[str] = None

    model_config = {"from_attributes": True}
from typing import Optional

from pydantic import BaseModel


class StageCreate(BaseModel):
    stage_name: str
    colour: Optional[str] = None

class StageUpdate(BaseModel):
    stage_name: Optional[str] = None
    colour: Optional[str] = None

class StageRead(BaseModel):
    id: int
    board_id: int
    stage_name: str
    colour: Optional[str] = None
    stage_position: int

    model_config = {"from_attributes": True}

class StageReorder(BaseModel):
    stage_ids: list[int]
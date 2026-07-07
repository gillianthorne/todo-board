from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BoardCreate(BaseModel):
    board_name: str
    colour: Optional[str] = None

class BoardUpdate(BaseModel):
    board_name: Optional[str] = None
    colour: Optional[str] = None

class BoardRead(BaseModel):
    id: int
    board_name: str
    colour: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
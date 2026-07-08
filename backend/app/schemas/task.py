from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    task_description: Optional[str] = None
    deadline: Optional[datetime] = None
    colour: Optional[str] = None
    parent_task_id: Optional[int] = None
    recurring_template_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    task_description: Optional[str] = None
    deadline: Optional[datetime] = None
    colour: Optional[str] = None
    parent_task_id: Optional[int] = None
    recurring_template_id: Optional[int] = None
    is_complete: Optional[bool] = None

class TaskRead(BaseModel):
    id: int
    stage_id: int
    parent_task_id: Optional[int] = None
    title: str
    task_description: Optional[str] = None
    deadline: Optional[datetime] = None
    task_position: int
    recurring_template_id: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    is_complete: bool

class TaskReorder(BaseModel):
    task_ids: list[int]
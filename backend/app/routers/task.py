from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import require_auth
from app.database import get_db
from app.crud.task import create_task, delete_task, get_task, get_tasks, move_task_state, reorder_tasks, update_task
from app.schemas.task import TaskCreate, TaskMove, TaskRead, TaskReorder, TaskUpdate
from app.models.task import Task
from app.routers.stage import get_stage_or_404
from app.crud.tag import get_tags
from app.models.tag import Tag


router = APIRouter(prefix="/boards/{board_id}/stages/{stage_id}/tasks", dependencies=[Depends(require_auth)])

def get_task_or_404(task_id: int, stage=Depends(get_stage_or_404) , db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if task is None or task.stage_id != stage.id:
        raise HTTPException(404, detail="Task not found")
    return task

def get_tags_or_404(tag_ids: list[int], db: Session = Depends(get_db)):
    tags = db.execute(select(Tag).where(Tag.id.in_(tag_ids))).scalars().all()

    if len(tags) != len(set(tag_ids)):
        found_ids = {tag.id for tag in tags}
        missing_ids = set(tag_ids) - found_ids
        raise HTTPException(404, detail=f"Tag(s) not found: {missing_ids}")

    return tags

@router.post("", response_model=TaskRead, status_code=201)
def create_task_route(task_in: TaskCreate, db: Session = Depends(get_db), stage=Depends(get_stage_or_404)):
    tags = get_tags_or_404(task_in.tag_ids, db)
    return create_task(db, task_in, stage.id, tags)

@router.get("", response_model=list[TaskRead])
def get_all_tasks_route(stage=Depends(get_stage_or_404), db: Session = Depends(get_db)):
    return get_tasks(db, stage.id)

@router.get("/{task_id}", response_model=TaskRead)
def get_task_route(task: Task = Depends(get_task_or_404)):
    return task

@router.patch("/{task_id}", response_model=TaskRead)
def update_task_route(task_in: TaskUpdate, task: Task = Depends(get_task_or_404), db: Session = Depends(get_db)):
    tags = None
    if "tag_ids" in task_in.model_fields_set:
        tags = get_tags_or_404(task_in.tag_ids, db)
    return update_task(db, task, task_in, tags)

@router.patch("/{task_id}/stage", response_model=TaskRead)
def move_task_state_route(move_in: TaskMove, task: Task = Depends(get_task_or_404), db: Session = Depends(get_db)):
    return move_task_state(db, task, move_in.new_stage_id)

@router.delete("/{task_id}", status_code=204)
def delete_task_route(task: Task = Depends(get_task_or_404), db: Session = Depends(get_db)):
    delete_task(db, task)

@router.put("/reorder", response_model=list[TaskRead])
def reorder_tasks_route(reorder_ids: TaskReorder, db: Session = Depends(get_db), stage=Depends(get_stage_or_404)):
    try:
        return reorder_tasks(db, stage.id, reorder_ids.task_ids)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
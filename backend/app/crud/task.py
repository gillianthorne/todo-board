from datetime import datetime

from sqlalchemy import select

from app.schemas.task import TaskCreate, TaskUpdate
from sqlalchemy.orm import Session

from app.models.task import Task

def create_task(db: Session, task_in: TaskCreate, stage_id: int) -> Task:
    tasks = db.execute(select(Task).where(Task.stage_id == stage_id)).scalars().all()
    if not tasks:
        position = 0
    else:
        position = max(task.task_position for task in tasks) + 1

    new_task = Task(
        title = task_in.title,
        task_description = task_in.task_description,
        colour = task_in.colour,
        parent_task_id = task_in.parent_task_id,
        recurring_template_id = task_in.recurring_template_id,
        task_position = position,
        stage_id = stage_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def get_tasks(db: Session, stage_id: int) -> list[Task]:
    tasks = db.execute(select(Task).where(Task.stage_id == stage_id).order_by(Task.task_position)).scalars().all()
    return tasks

def get_task(db: Session, task_id: int) -> Task | None:
    task = db.get(Task, task_id)
    return task

def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    updated_fields = task_in.model_dump(exclude_unset=True)

    for key, value in updated_fields.items():
        setattr(task, key, value)

    if ("is_complete", True) in updated_fields.items():
        setattr(task, "completed_at", datetime.now())
    elif ("is_complete", False) in updated_fields.items():
        setattr(task, "completed_at", None)

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()

    remaining_tasks = db.execute(select(Task).where(Task.stage_id == task.stage_id).order_by(Task.task_position)).scalars().all()

    for index, t in enumerate(remaining_tasks):
        t.task_position = index

    db.commit()

def reorder_tasks(db: Session, stage_id: int, task_ids: list[int]) -> list[Task]:
    current_tasks = db.execute(select(Task).where(Task.stage_id == stage_id).order_by(Task.task_position)).scalars().all()

    if set(task_ids) == set([task.id for task in current_tasks]):
        for index, task_id in enumerate(task_ids):
            db.get(Task, task_id).task_position = index
    else:
        raise ValueError("Provided Task ID list does not match list of Tasks associated with this stage_id.")
    
    db.commit()
    
    refreshed_tasks = db.execute(select(Task).where(Task.stage_id == stage_id).order_by(Task.task_position)).scalars().all()

    return refreshed_tasks

def move_task_state(db: Session, task: Task, new_stage_id: int) -> Task:
    old_stage_id = task.stage_id
    new_tasks = db.execute(select(Task).where(Task.stage_id == new_stage_id).order_by(Task.task_position)).scalars().all()

    if not new_tasks:
        position = 0
    else:
        position = max(task.task_position for task in new_tasks) + 1

    task.stage_id = new_stage_id
    task.task_position = position

    db.commit()
    db.refresh(task)

    old_tasks = db.execute(select(Task).where(Task.stage_id == old_stage_id).order_by(Task.task_position)).scalars().all()

    for index, t in enumerate(old_tasks):
        t.task_position = index

    db.commit()
    
    return task


    
    
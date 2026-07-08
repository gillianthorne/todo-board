from sqlalchemy import select
from sqlalchemy.orm import Session
from app.schemas.stage import StageCreate, StageUpdate
from app.models.stage import Stage

def create_stage(db: Session, stage_in: StageCreate, board_id: int) -> Stage:
    stages = db.execute(select(Stage).where(Stage.board_id == board_id)).scalars().all()
    if not stages:
        position = 0
    else:
        max_stage = max(stage.stage_position for stage in stages)
        position = max_stage + 1

    new_stage = Stage(
        stage_name=stage_in.stage_name,
        colour=stage_in.colour,
        stage_position=position,
        board_id=board_id
    )

    db.add(new_stage)
    db.commit()
    db.refresh(new_stage)
    return new_stage


def get_stages(db: Session, board_id: int) -> list[Stage]:
    stages = db.execute(select(Stage).where(Stage.board_id == board_id).order_by(Stage.stage_position)).scalars().all()
    return stages

def get_stage(db: Session, stage_id: int) -> Stage | None:
    stage = db.get(Stage, stage_id)
    return stage

def update_stage(db: Session, stage: Stage, stage_in: StageUpdate) -> Stage:
    updated_fields = stage_in.model_dump(exclude_unset=True)

    for key, value in updated_fields.items():
        setattr(stage, key, value)

    db.commit()
    db.refresh(stage)
    return stage


def delete_stage(db: Session, stage: Stage) -> None:
    db.delete(stage)
    db.commit()

    remaining_stages = db.execute(select(Stage).where(Stage.board_id == stage.board_id).order_by(Stage.stage_position)).scalars().all()

    for index, s in enumerate(remaining_stages):
        s.stage_position = index

    db.commit()


def reorder_stages(db: Session, board_id: int, stage_ids: list[int]) -> list[Stage]:
    current_stages = db.execute(select(Stage).where(Stage.board_id == board_id).order_by(Stage.stage_position)).scalars().all()

    if set(stage_ids) == set([stage.id for stage in current_stages]):
        for index, stage_id in enumerate(stage_ids):
            db.get(Stage, stage_id).stage_position = index
    else:
        raise ValueError("Provided Stage ID list does not match list of Stages associated with this board_id.")
    
    db.commit()

    refreshed_stages = db.execute(select(Stage).where(Stage.board_id == board_id).order_by(Stage.stage_position)).scalars().all()


    return refreshed_stages
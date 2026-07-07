from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud.stage import create_stage, delete_stage, get_stage, get_stages, reorder_stages, update_stage
from app.database import get_db
from app.schemas.stage import StageCreate, StageRead, StageReorder, StageUpdate
from app.deps import require_auth
from app.models.stage import Stage

router = APIRouter(prefix="/boards/{board_id}/stages", dependencies=[Depends(require_auth)])

def get_stage_or_404(board_id: int, stage_id: int, db: Session = Depends(get_db)):
    stage = get_stage(db, stage_id)
    if stage is None or stage.board_id != board_id:
        raise HTTPException(404, detail="Stage not found")
    return stage

@router.post("", response_model=StageRead, status_code=201)
def create_stage_route(board_id: int, stage_in: StageCreate, db: Session = Depends(get_db)):
    return create_stage(db, stage_in, board_id)

@router.get("", response_model=list[StageRead])
def get_all_stages_route(board_id: int, db: Session = Depends(get_db)):
    return get_stages(db, board_id)

@router.get("/{stage_id}", response_model=StageRead)
def get_stage_route(stage: Stage = Depends(get_stage_or_404)):
    return stage

@router.patch("/{stage_id}", response_model=StageRead)
def update_stage_route(stage_in: StageUpdate, stage: Stage = Depends(get_stage_or_404), db: Session = Depends(get_db)):
    return update_stage(db, stage, stage_in)

@router.delete("/{stage_id}", status_code=204)
def delete_stage_route(stage: Stage = Depends(get_stage_or_404), db: Session = Depends(get_db)):
    delete_stage(db, stage)

@router.put("/reorder", response_model=list[StageRead])
def reorder_stage_route(board_id: int, reorder_ids: StageReorder, db: Session = Depends(get_db)):
    try:
        return reorder_stages(db, board_id, reorder_ids.stage_ids)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.crud.board import create_board, delete_board, get_board, get_boards, update_board
from app.database import get_db
from app.models.board import Board
from app.schemas.board import BoardCreate, BoardRead, BoardUpdate

router = APIRouter(prefix="/boards")

def get_board_or_404(board_id: int, db: Session = Depends(get_db)):
    board = get_board(db, board_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return board

@router.post("", response_model=BoardRead, status_code=201)
def create_board_route(board_in: BoardCreate, db: Session = Depends(get_db)):
    return create_board(db, board_in)

@router.get("", response_model=list[BoardRead])
def get_all_boards_route(db: Session = Depends(get_db)):
    return get_boards(db)

@router.get("/{board_id}", response_model=BoardRead)
def get_board_route(board: Board = Depends(get_board_or_404)):
    return board

@router.patch("/{board_id}", response_model=BoardRead)
def update_board_route(board_in: BoardUpdate, board: Board = Depends(get_board_or_404), db: Session = Depends(get_db)):
    return update_board(db, board, board_in)

@router.delete("/{board_id}", status_code=204)
def delete_board_route(board: Board = Depends(get_board_or_404), db: Session = Depends(get_db)):
    delete_board(db, board)
from sqlalchemy import select

from app.models.board import Board
from app.schemas.board import BoardCreate, BoardUpdate
from sqlalchemy.orm import Session


def create_board(db: Session, board_in: BoardCreate) -> Board:
    new_board = Board(board_name=board_in.board_name, colour=board_in.colour)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

def get_boards(db: Session) -> list[Board]:
    boards = db.execute(select(Board)).scalars.all()
    return boards

def get_board(db: Session, board_id: int) -> Board | None:
    board = db.get(Board, board_id)
    return board

def update_board(db: Session, board: Board, board_in: BoardUpdate) -> Board:
    updated_fields = board_in.model_dump(exclude_unset=True)

    for key, value in updated_fields.items():
        setattr(board, key, value)
    
    db.commit()
    db.refresh(board)
    return board

def delete_board(db: Session, board: Board) -> None:
    db.delete(board)
    db.commit()
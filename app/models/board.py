from datetime import datetime
from sqlalchemy import DateTime, String, func
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    board_name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    stages: Mapped[list["Stage"]] = relationship(back_populates="board")
    recurring_templates: Mapped[list["RecurringTemplate"]] = relationship(back_populates="board")

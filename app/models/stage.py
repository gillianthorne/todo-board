from sqlalchemy import ForeignKey, String

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Stage(Base):
    __tablename__ = "stages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"))
    stage_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stage_position: Mapped[int] = mapped_column(nullable=False)

    board: Mapped["Board"] = relationship(back_populates="stages")
    tasks: Mapped[list["Task"]] = relationship(back_populates="stage")


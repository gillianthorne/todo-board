from datetime import date
from typing import Optional

from sqlalchemy import Date, ForeignKey, String
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class RecurringTemplate(Base):
    __tablename__ = "recurring_templates"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255))
    recurring_template_description: Mapped[Optional[str]] = mapped_column(String(1000))
    recurrence_rule: Mapped[str] = mapped_column(String(255))
    next_run_date: Mapped[date] = mapped_column(Date)

    board: Mapped["Board"] = relationship(back_populates="recurring_templates")
    tasks: Mapped[list["Task"]] = relationship(back_populates="recurring_template")

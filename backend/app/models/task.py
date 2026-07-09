from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Table, func
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    stage_id: Mapped[int] = mapped_column(ForeignKey('stages.id', ondelete="CASCADE"))
    parent_task_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    task_description: Mapped[Optional[str]] = mapped_column(String(1000))
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime)
    task_position: Mapped[int] = mapped_column(nullable=False)
    recurring_template_id: Mapped[Optional[int]] = mapped_column(ForeignKey('recurring_templates.id', ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_complete: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    colour: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)

    stage: Mapped["Stage"] = relationship(back_populates="tasks")
    recurring_template: Mapped[Optional["RecurringTemplate"]] = relationship(back_populates="tasks")
    parent: Mapped[Optional["Task"]] = relationship(remote_side="Task.id", back_populates="subtasks")
    subtasks: Mapped[list["Task"]] = relationship(back_populates="parent")
    tags: Mapped[list["Tag"]] = relationship(secondary="task_tags", back_populates="tasks")


task_tags = Table(
    "task_tags",
    Base.metadata,
    Column("task_id", ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
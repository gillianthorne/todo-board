from app.database import Base
from app.models.board import Board
from app.models.recurring_template import RecurringTemplate
from app.models.stage import Stage
from app.models.tag import Tag
from app.models.task import Task, task_tags
from sqlalchemy.orm import configure_mappers


def test_all_models_and_mappers_configure():
    configure_mappers()

    expected_tables = {"boards", "stages", "tasks", "tags", "recurring_templates", "task_tags"}
    actual_tables = set(Base.metadata.tables.keys())

    assert expected_tables.issubset(actual_tables)
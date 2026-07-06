import sqlalchemy

from app.database import engine

def test_database_connection():
    with engine.connect() as conn:
        conn.execute(sqlalchemy.text("SELECT 1"))
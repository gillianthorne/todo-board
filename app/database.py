from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from decouple import config

DATABASE_URL = f"mysql+pymysql://{config('DB_USERNAME')}:{config('DB_PASSWORD')}@{config('DB_HOST')}:{config('DB_PORT')}/{config('DB_NAME')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass
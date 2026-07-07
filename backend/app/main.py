from starlette.middleware.sessions import SessionMiddleware
from decouple import config
from fastapi import APIRouter, Depends, FastAPI

from app.deps import require_auth
from app.routers import auth, board

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=config('SECRET_KEY'))

app.include_router(auth.router)
app.include_router(board.router)
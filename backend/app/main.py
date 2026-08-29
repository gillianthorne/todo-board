from starlette.middleware.sessions import SessionMiddleware
from decouple import config
from fastapi import APIRouter, Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.deps import require_auth
from app.routers import auth, board, stage, task, tag

# Check if you are in production or local development
IS_PRODUCTION = config('ENVIRONMENT', default='development') == 'production'

app = FastAPI()

app.add_middleware(
    SessionMiddleware, 
    secret_key=config('SECRET_KEY'), 
    # Use "lax" for local HTTP, "none" for cross-domain production HTTPS
    same_site="none" if IS_PRODUCTION else "lax", 
    # Require HTTPS/Secure flag only in production
    https_only=IS_PRODUCTION 
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config('FRONTEND_ORIGIN')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(board.router)
app.include_router(stage.router)
app.include_router(task.router)
app.include_router(tag.router)
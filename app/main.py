from starlette.middleware.sessions import SessionMiddleware
from decouple import config
from fastapi import FastAPI

from app.routers import auth

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=config('SECRET_KEY'))

app.include_router(auth.router)
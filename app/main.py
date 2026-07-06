from starlette.middleware.sessions import SessionMiddleware
from decouple import config

app.add_middleware(SessionMiddleware, secret_key=config('SECRET_KEY'))

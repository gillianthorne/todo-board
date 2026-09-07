from fastapi import APIRouter, Depends, HTTPException, Request

from app.auth import check_password
from app.schemas.auth import LoginRequest
from app.deps import require_auth

router = APIRouter()

@router.post("/login")
def login(request: Request, credentials: LoginRequest):
    correct_password = check_password(credentials.password)

    if correct_password:
        request.session["logged_in"] = True
        return {"message": "Logged in successfully"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect password.")


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out successfully"}

@router.get("/me")
def me(_ = Depends(require_auth)):
    return {"status": "ok"}
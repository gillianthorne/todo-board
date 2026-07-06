from fastapi import HTTPException, Request


def require_auth(request: Request):
    if not request.session.get("logged_in"):
        raise HTTPException(status_code=401, detail="Not authenticated")
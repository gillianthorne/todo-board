import bcrypt
from decouple import config

def check_password(submitted_pw):
    hashed_pw = config('HASHED_PASSWORD').encode('utf-8')
    submitted_pw_bytes = submitted_pw.encode('utf-8')
    is_correct = bcrypt.checkpw(submitted_pw_bytes, hashed_pw)

    return is_correct
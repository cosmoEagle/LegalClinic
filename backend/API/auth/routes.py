from fastapi import APIRouter, HTTPException
from model import User
from db import users_collection
from auth.utils import hash_password, verify_password

router = APIRouter()

@router.post("/register")
def register(user: User):
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pw = hash_password(user.password)
    user_dict = {"username": user.username, "password": hashed_pw}
    users_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: User):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    return {"message": "Login successful"}

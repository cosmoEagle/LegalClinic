from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    username: str
    role: str
    chat: str
    new_chat: Optional[bool] = False 

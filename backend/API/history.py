from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from bson import ObjectId
from db import history_collection
from model import ChatRequest

router = APIRouter()

@router.post("/save_chat/")
async def save_chat(data: ChatRequest):
    now = datetime.utcnow()

    message = {
        "role": data.role,
        "chat": data.chat,
        "timestamp": now
    }

    try:
        if data.new_chat:
            new_session = {
                "username": data.username,
                "session_id": ObjectId(),
                "started_at": now,
                "messages": [message]
            }
            history_collection.insert_one(new_session)
            return {"status": "success", "message": "New chat session created"}

        latest_session = history_collection.find_one(
            {"username": data.username},
            sort=[("started_at", -1)]
        )

        if not latest_session or (now - latest_session["started_at"]) > timedelta(minutes=60):
            new_session = {
                "username": data.username,
                "session_id": ObjectId(),
                "started_at": now,
                "messages": [message]
            }
            history_collection.insert_one(new_session)
            return {"status": "success", "message": "New session created"}

        history_collection.update_one(
            {"_id": latest_session["_id"]},
            {"$push": {"messages": message}}
        )
        return {"status": "success", "message": "Message added to existing session"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{username}")
async def get_user_sessions(username: str):
    try:
        sessions = list(history_collection.find(
            {"username": username},
            {"_id": 0, "session_id": 1, "started_at": 1, "messages": 1}
        ).sort("started_at", -1))

        if not sessions:
            raise HTTPException(status_code=404, detail="No sessions found for this user.")

        for session in sessions:
            session["session_id"] = str(session["session_id"])
            if "messages" in session and session["messages"]:
                session["messages"][0]["timestamp"] = str(session["messages"][0]["timestamp"])
            session["started_at"] = str(session["started_at"])

        return {"sessions": sessions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




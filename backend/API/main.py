from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from history import router as chat_router

app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():
    return {"message": "API CREATED BY D (TEAM Techvocates)"}

app.include_router(auth_router, prefix="/auth")
app.include_router(chat_router, prefix="/chat")

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import re
from qa import RAG
from doc_gen import preprocessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

def remove_formatting(output):
    output = re.sub(r'\[[0-9;m]+', '', output)  
    output = re.sub(r'\x1b', '', output) 
    return output.strip()

@app.post("/chat")
async def chat(request: QueryRequest):
    try:
        result = RAG.processing_agent(query=request.query)
        final_output = result.get("output")
        return final_output
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.post("/doc_gen")
async def chat(request: QueryRequest):
    try:
        result = preprocessing(query=request.query)
        final_output = result.get("output")
        return final_output
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

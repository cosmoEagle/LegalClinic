from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import re
from qa import RAG
from doc_gen import preprocessing
from bail import Reckoner

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
    
@app.post("/bail_application/")
async def submit_bail_application(request: Request):
    
    application = await request.json()
    reckoner = Reckoner()
    
    print(application)
    
    selected_act = application.get('case_details', {}).get('Acts of Offence', [])
    sections_input = application.get('case_details', {}).get('sections_of_offence', [])
    print(type(selected_act))
    print(type(sections_input))

    # Fetch, parse, and process the data
    acts = reckoner.fetch(selected_act, sections_input)
    parsed = reckoner.parse(acts)
    offences = reckoner.llm_parser(parsed)
    application['offences'] = offences
    # Evaluate the final result
    print(application)
    result = reckoner.evaluator(application)
    print(result)
    return result
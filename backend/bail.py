import os
import regex as re
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from google import generativeai as genai
from time import time
from prompt_library import Prompt
from database import get_desc

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
uri = os.environ['MONGO_URI']
client = MongoClient(uri, server_api=ServerApi('1'))

acts = {
    "THE BHARATIYA NYAYA SANHITA, 2023": "BNS",
    "THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023":"BNSS",
    "THE CODE OF CRIMINAL PROCEDURE, 1973":"CrPC",
    "THE PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005":"DVA",
    "THE INDIAN PENAL CODE":"IPC",
    "THE INDECENT REPRESENTATION OF WOMEN (PROHIBITION) ACT, 1986":"IRWA",
    "THE IMMORAL TRAFFIC (PREVENTION) ACT, 1956":"ITA",
    "THE INFORMATION TECHNOLOGY ACT, 2000":"ITAct",
    "THE JUVENILE JUSTICE (CARE AND PROTECTION OF CHILDREN) ACT, 2015":"JJA",
    "THE NATIONAL INVESTIGATION AGENCY ACT, 2008":"NIA",
    "THE NATIONAL SECURITY ACT, 1980":"NSA",
    "THE PREVENTION OF CORRUPTION ACT, 1988":"PCA",
    "THE PREVENTION OF MONEY-LAUNDERING ACT, 2002":"PMLA",
    "THE PROTECTION OF CHILDREN FROM SEXUAL OFFENCES ACT, 2012":"POSCO",
    "THE SCHEDULED CASTES AND THE SCHEDULED TRIBES (PREVENTION OF ATROCITIES) ACT, 1989":"SCSTAct",
    "THE UNLAWFUL ACTIVITIES (PREVENTION) ACT, 1967":"UAPA"
}

class Reckoner:
    def __init__(self) -> None:
        pass

    def llm(self, instruction:str):
        return genai.GenerativeModel('gemini-1.5-flash', system_instruction=instruction)
    

    def fetch(self, collection_name: list, section_number: str):
        collection_name = [acts[col] for col in collection_name]
        print(collection_name)
        return get_desc(collection_name, section_number)


    def parse(self, text:str):
        model = self.llm(instruction=Prompt.ParseInstruction)
        parsed_response = model.generate_content(Prompt.ParsePrompt(text)).text
        json_string = re.search(r'\{.*\}', parsed_response, re.DOTALL)
        return json.loads(json_string.group(0))
    
    def llm_parser(self, data:dict):
        results = {}
        # collection_name = [acts[col] for col in collection_name]
        for collection_name, sections in data.items():
            print(collection_name, "llmparser")
            print(sections)
            collection = client['Indian_Acts'][collection_name]
            query = {'Section_Number': {'$in': sections}}
            result = collection.find(query)
            response = [res for res in result]
        
        return response
    
    def evaluator(self, input):
        model = self.llm(instruction=Prompt.evaluator)
        return model.generate_content(Prompt.evalPrompt(input)).text


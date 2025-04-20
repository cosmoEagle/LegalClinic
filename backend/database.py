from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.environ['MONGO_URI']

client = MongoClient(uri, server_api=ServerApi('1'))

def get_desc(collection_name: list, section_number: str):
    print(section_number)
    print(type(section_number))
    sections = [sec.strip() for sec in section_number.split(",")]
    db = client['Indian_Acts']
    section_desc = list()
    for col in collection_name:
        collection = db[col]
        
        query = {'Section_Number': {'$in': sections}}
        results = collection.find(query)
        for res in results:
            section_desc.append(res['Description'])
    return section_desc
    

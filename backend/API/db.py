from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://<username>:<password>@datainfo.nqxv2sl.mongodb.net/?retryWrites=true&w=majority&appName=DataInfo"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.auth_db
users_collection = db.users
history_collection= db.history
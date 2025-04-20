from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.core import Settings
from dotenv import load_dotenv
import os

load_dotenv()

# AzureOpenAIEmbeddings
api_key = os.environ['AZURE_API_KEY']
azure_endpoint = os.environ['AZURE_EMBED_ENDPOINT']
api_version = os.environ['AZURE_EMBED_VERSION']

embed_model = AzureOpenAIEmbedding(
    model="text-embedding-ada-002",
    deployment_name="text-embedding-ada-002",
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
)

Settings.embed_model = embed_model

# AzureOpenAI
aoai_api_key = os.environ['AZURE_API_KEY']
aoai_endpoint = os.environ['AZURE_ENDPOINT']
aoai_api_version = os.environ['AZURE_VERSION']

llm = AzureOpenAI(
    engine="agile4",
    model="gpt-4",
    api_key=aoai_api_key,
    azure_endpoint=aoai_endpoint,
    api_version=aoai_api_version,
)

Settings.llm = llm
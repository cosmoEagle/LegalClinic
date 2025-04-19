from julep import Julep
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.core import Settings

# Julep
client = Julep(
    api_key="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAyMTExMDUsImlhdCI6MTc0NTAyNzEwNSwic3ViIjoiMWM1N2YxNWUtNjk4OC01ZTI0LTkxOTctMzM4OWUxOTNiNjJhIn0.48Aao6glDi8xyKUaWA2qWOEnCU9NI7_aUwnZz4GQFz4oMvpi-4Ii0KfX5gcXBRD-Eo6ppYPazZ-agM4sD1kBOw",
    environment= 'production' #'development'
)

# AzureOpenAIEmbeddings
api_key = "0f6fa5dad4ed43e4ade101f9f4795dd3"
azure_endpoint = "https://agile.openai.azure.com/openai/deployments/text-embedding-ada-002/embeddings?api-version=2023-05-15"
api_version = "2023-05-15"

embed_model = AzureOpenAIEmbedding(
    model="text-embedding-ada-002",
    deployment_name="text-embedding-ada-002",
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
)

Settings.embed_model = embed_model

# AzureOpenAI
aoai_api_key = "0f6fa5dad4ed43e4ade101f9f4795dd3"
aoai_endpoint = "https://agile.openai.azure.com/"
aoai_api_version = "2024-12-01-preview"

llm = AzureOpenAI(
    engine="agile4",
    model="gpt-4",
    api_key=aoai_api_key,
    azure_endpoint=aoai_endpoint,
    api_version=aoai_api_version,
)

Settings.llm = llm
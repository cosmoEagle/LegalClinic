import utils

from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
)
from llama_index.vector_stores.faiss import FaissVectorStore

import faiss
import os

d = 1536
faiss_index = faiss.IndexFlatL2(d)

dir_path = './data'

for i in os.listdir(dir_path):
    file = os.path.join(dir_path, i)
    documents = SimpleDirectoryReader(input_files=[file]).load_data()

    vector_store = FaissVectorStore(faiss_index=faiss_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context, show_progress=True
    )

    index.storage_context.persist(persist_dir="./storage/"+i.strip(".pdf"))
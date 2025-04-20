import os
import logging
import sys
import re
import templates as tm


from llama_index.core import StorageContext, load_index_from_storage, SummaryIndex, Settings
from llama_index.core.indices.vector_store.retrievers.retriever import VectorIndexRetriever
from llama_index.core.vector_stores.types import VectorStoreQueryMode
from llama_index.core import VectorStoreIndex
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.schema import IndexNode
from llama_index.core.retrievers import RecursiveRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import get_response_synthesizer
from llama_index.agent.openai import OpenAIAgent
from llama_index.llms.azure_openai import AzureOpenAI as op1

from typing import List, Union

from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import Tool

from templates import template1
import utils

def preprocessing(query: str):
    names = ["The Indian Contract Act, 1872","The Specific Relief Act, 1963","The Transfer of Property Act, 1882", "The Uttar Pradesh Urban Buildings (Regulation of Letting, Rent and Eviction) Act, 1972", "The Right to Information Act, 2005"]
    descriptions = ["The go-to document for Contract Rules. The Indian Contract Act, 1872 is a fundamental legal framework in India that governs the formation and enforcement of contracts, defining the rules and principles that underlie agreements between parties in various transactions.", "The go-to document for Relief Rules. The Specific Relief Act, 1963 is an Indian legal statute that governs the remedies available for the enforcement of civil rights and obligations, emphasizing the specific performance of contracts as a primary remedy.", "The go-to document for Rules for transferring property and its rights. The Transfer of Property Act, 1882 is a legal statute in India that governs the transfer of property from one person to another. It defines various types of property transactions, including sales, mortgages, leases, and gifts, and sets out the legal rules and procedures for such transfers.", "The go-to document for Rules and Regulations for Rent in Uttar Pradesh. The Uttar Pradesh Urban Buildings Act of 1972 regulates the rental and eviction of urban properties in the Indian state of Uttar Pradesh", "The Right to Information Act (RTI) of 2005 empowers Indian citizens to request information from public authorities to promote transparency and accountability. It mandates a response within 30 days, with exemptions for national security and personal privacy. It includes appeal mechanisms and penalties for non-compliance."]
    temp = ['ica', 'sra', 'tpa', 'upra', 'rti']

    agents = {}

    for n,x in enumerate(temp):
        storage_context = StorageContext.from_defaults(persist_dir=x)
        
        vector_index = load_index_from_storage(storage_context=storage_context, index_id="vector_index")
        summary_index = load_index_from_storage(storage_context=storage_context, index_id="vector_index")
        
        vector_query_engine = vector_index.as_query_engine()
        list_query_engine = summary_index.as_query_engine()
        
        query_engine_tools = [
            QueryEngineTool(
                query_engine = vector_query_engine,
                metadata = ToolMetadata(name = temp[n],description= descriptions[n])
            ),
            QueryEngineTool(
                query_engine = list_query_engine,
                metadata =  ToolMetadata(name = temp[n], description= descriptions[n])
            )
        ]
        function_llm = op1(
            azure_endpoint=os.environ['AZURE_ENDPOINT'],
            api_key=os.environ['AZURE_API_KEY'],
            api_version=os.environ['AZURE_VERSION'],
            azure_deployment="agile4",
            model='gpt-4',
        )
        agent = OpenAIAgent.from_tools(
            query_engine_tools,
            llm=function_llm,
            verbose=True,
        )
        agents[x] = agent

    nodes = []
    for n,x in enumerate(names):
        act_summary = (
            f"This content contains Acts about {x}. "
            f"Use this index if you need to lookup specific facts about {x}.\n"
            "Do not use this index if you want to analyze multiple acts."
        )
        node = IndexNode(text=act_summary, index_id=temp[n])
        nodes.append(node)

    vector_index = VectorStoreIndex(nodes)
    vector_retriever = vector_index.as_retriever(similarity_top_k=1)

    recursive_retriever = RecursiveRetriever(
        "vector",
        retriever_dict={"vector": vector_retriever},
        query_engine_dict=agents,
        verbose=True,
    )

    response_synthesizer = get_response_synthesizer(
        # service_context=service_context,
        response_mode="compact",
    )
    query_engine = RetrieverQueryEngine.from_args(
        recursive_retriever,
        response_synthesizer=response_synthesizer,
    )

    tools = [
        Tool(
            name = "Llama-Index",
            func = query_engine.query,
            description = f"Useful for when you want to extract content. The input to this tool should be a complete English sentence. Works best if you redirect the entire query back into this.",
            return_direct = True
        )
    ]

    prompt = PromptTemplate(
        template = tm.template1,
        input_variables=["input", "intermediate_steps", "agent_scratchpad", "tools", "tool_names"]
    )


    llm = AzureChatOpenAI(
            azure_endpoint=os.environ['AZURE_ENDPOINT'],
            api_key=os.environ['AZURE_API_KEY'],
            api_version=os.environ['AZURE_VERSION'],
            azure_deployment="agile4",
            model='gpt-4',
        )

    agent = create_react_agent(
        llm=llm,
        tools=tools,
        prompt=prompt,
    )

    agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)

    return agent_executor.invoke({"input":query})
    
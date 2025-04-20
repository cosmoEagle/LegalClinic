import os
import re
import tempfile
import time
import openai
import faiss
from typing import List, Union

from llama_index.core import StorageContext, Settings, load_index_from_storage
from llama_index.core import SimpleDirectoryReader
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.query_engine import RouterQueryEngine, SubQuestionQueryEngine, CitationQueryEngine
from llama_index.core.langchain_helpers.agents.tools import IndexToolConfig, LlamaIndexTool
from llama_index.core.agent import ReActAgent
from llama_index.vector_stores.faiss import FaissVectorStore

from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import Tool

import utils

import nest_asyncio
nest_asyncio.apply()

class RAG:

    names = ["The Insurance Act, 1938: Regulations and Restrictions for Insurance Companies in India"]
    names.append("The Consumer Protection Act, 1986")
    names.append("The Insurance Regulatory and Development Authority Act, 1999")
    names.append("The Motor Vehicles Act, 1988")
    descriptions = ["The go-to document for Insurance Rules. The Insurance Act, 1938 is an Act to consolidate and amend the law relating to the business of insurance in India. It outlines the regulations for insurance companies, including registration, capital requirements, investment, loans and management, investigation, appointment of staff, control over management, amalgamation and transfer of insurance business, commission and rebates, licensing of agents, management by administrator, and acquisition of the undertakings of insurers in certain cases. It also outlines the voting rights of shareholders, the requirements for making a declaration of interest in a share held in the name of another person, the requirements for the separation of accounts and funds for different classes of insurance business, the audit and actuarial report and abstract that must be conducted annually, the power of the Authority to order revaluation and to inspect returns, the power of the Authority to make rules and regulations, the power of the Authority to remove managerial persons from office, appoint additional directors, and issue directions regarding re-insurance treaties, the power of the Authority to enter and search any building or place where books, accounts, or other documents relating to any claim, rebate, or commission are kept, the prohibition of cessation of payments of commission, the prohibition of offering of rebates as an inducement to take out or renew an insurance policy, the process for issuing a registration to act as an intermediary or insurance intermediary, the process for repudiating a life insurance policy on the ground of fraud, the prohibition of insurance agents, intermediaries, or insurance intermediaries to be or remain a director in an insurance company, the requirement to give notice to the policy-holder informing them of the options available to them on the lapsing of a policy, and the power of the National Company Law Tribunal to order the winding up of an insurance company. Penalties for non-compliance range from fines to imprisonment. The Act also outlines the formation of the Life Insurance Council and General Insurance Council, and the Executive Committees of each, the Tariff Advisory Committee, and the obligations of insurers in respect of rural or social or unorganized sector and backward classes."]
    descriptions.append("The Consumer Protection Act, 1986 is an Act that provides better protection for the interests of consumers in India, except for the State of Jammu and Kashmir. It defines a consumer as any person who buys goods or services for a consideration. The Act outlines the composition and jurisdiction of District Forums, State Commissions, and the National Commission, which are responsible for resolving consumer disputes. It also provides protection of action taken in good faith, and lays out rules for the Central and State Governments.")
    descriptions.append("The Insurance Regulatory and Development Authority Act Act, 1999 established the Insurance Regulatory and Development Authority of India (IRDAI) to regulate, promote, and ensure orderly growth of the insurance sector. It empowers IRDAI to license entities, protect policyholders, oversee operations, and amend existing insurance laws, ensuring transparency, accountability, and development within the insurance industry.")
    descriptions.append("The Motor Vehicles Act, 1988 regulates all aspects of road transport in India, including licensing, registration, permits, traffic control, insurance, liability, and penalties. It ensures road safety, sets standards for drivers and vehicles, and establishes legal frameworks for compensation, offences, and enforcement by authorities at both state and central levels.")
    
    def query_engine(self):
        query_engine_tools = []
        temp = ['insurance', 'cpa', 'irda', 'mva']
        for n, x in enumerate(temp):
            path = os.path.join("./storage/",x)
            vector_store = FaissVectorStore.from_persist_dir(persist_dir=path)
            storage_context = StorageContext.from_defaults(
                vector_store=vector_store,
                persist_dir=path
            )
            index = load_index_from_storage(storage_context=storage_context)
            engine = index.as_query_engine(similarity_top_k=3)
            query_engine_tools.append(QueryEngineTool(
                query_engine = engine,
                metadata = ToolMetadata(name = RAG.names[n], description = RAG.descriptions[n])
            ))
        # query_engine = RouterQueryEngine.from_defaults(query_engine_tools = query_engine_tools)
        query_engine = SubQuestionQueryEngine.from_defaults(query_engine_tools=query_engine_tools, use_async=True)

        return query_engine
    
    @staticmethod
    def processing_agent(query:str):

        rag_instance = RAG()
        query_engine = rag_instance.query_engine()
    
        tools = [Tool(
            name="Llama-Index",
            func=query_engine.query,
            description=f"Useful for when you want to answer questions. The input to this tool should be a complete English sentence. Works best if you redirect the entire query back into this. This is an AI Assistant, ask complete questions, articulate well.",
            return_direct=True
            )
        ]

        template1 = """
                        You are a Smart Insurance Agent Assistant. The Agent will ask you domain specific questions. The tools provided to you have smart interpretibility if you specify keywords in your query to the tool [Example a query for two wheeler insurance rules should mention two wheelers]. You have access to the following tools:

                        {tools}

                        Use the following format:

                        Question: the input question you must answer
                        Thought: you should always think about what to do
                        Action: the action to take, should be one of [{tool_names}]
                        Action Input: the input to the action, a complete English sentence
                        Observation: the result of the action
                        ... (this Thought/Action/Action Input/Observation can repeat N times)
                        Thought: I now know the final answer
                        Final Answer: the final answer to the original input question

                        Begin! Remember to be ethical and articulate when giving your final answer. Use lots of "Arg"s

                        Question: {input}
                        {agent_scratchpad}"""

        prompt = PromptTemplate(
            template=template1,
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

# inst = RAG.processing_agent(query="I got accident with my car, and a dog was killed in that incident, so what could be the legal consequences?")

# print(inst.get('output'))

# def remove_formatting(output):
#         output = re.sub('\[[0-9;m]+', '', output)  
#         output = re.sub('\', '', output) 
#         return output.strip()

# output = remove_formatting(inst)

# print(output)
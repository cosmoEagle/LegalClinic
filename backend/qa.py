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
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.vector_stores.faiss import FaissVectorStore

import utils
from utils import client

os.environ["KMP_DUPLICATE_LIB_OK"] = "True"

import nest_asyncio
nest_asyncio.apply()

names = ["The Insurance Act, 1938: Regulations and Restrictions for Insurance Companies in India"]
names.append("The Consumer Protection Act, 1986")
names.append("The Insurance Regulatory and Development Authority Act, 1999")
names.append("The Motor Vehicles Act, 1988")
descriptions = ["The go-to document for Insurance Rules. The Insurance Act, 1938 is an Act to consolidate and amend the law relating to the business of insurance in India. It outlines the regulations for insurance companies, including registration, capital requirements, investment, loans and management, investigation, appointment of staff, control over management, amalgamation and transfer of insurance business, commission and rebates, licensing of agents, management by administrator, and acquisition of the undertakings of insurers in certain cases. It also outlines the voting rights of shareholders, the requirements for making a declaration of interest in a share held in the name of another person, the requirements for the separation of accounts and funds for different classes of insurance business, the audit and actuarial report and abstract that must be conducted annually, the power of the Authority to order revaluation and to inspect returns, the power of the Authority to make rules and regulations, the power of the Authority to remove managerial persons from office, appoint additional directors, and issue directions regarding re-insurance treaties, the power of the Authority to enter and search any building or place where books, accounts, or other documents relating to any claim, rebate, or commission are kept, the prohibition of cessation of payments of commission, the prohibition of offering of rebates as an inducement to take out or renew an insurance policy, the process for issuing a registration to act as an intermediary or insurance intermediary, the process for repudiating a life insurance policy on the ground of fraud, the prohibition of insurance agents, intermediaries, or insurance intermediaries to be or remain a director in an insurance company, the requirement to give notice to the policy-holder informing them of the options available to them on the lapsing of a policy, and the power of the National Company Law Tribunal to order the winding up of an insurance company. Penalties for non-compliance range from fines to imprisonment. The Act also outlines the formation of the Life Insurance Council and General Insurance Council, and the Executive Committees of each, the Tariff Advisory Committee, and the obligations of insurers in respect of rural or social or unorganized sector and backward classes."]
descriptions.append("The Consumer Protection Act, 1986 is an Act that provides better protection for the interests of consumers in India, except for the State of Jammu and Kashmir. It defines a consumer as any person who buys goods or services for a consideration. The Act outlines the composition and jurisdiction of District Forums, State Commissions, and the National Commission, which are responsible for resolving consumer disputes. It also provides protection of action taken in good faith, and lays out rules for the Central and State Governments.")
descriptions.append("The Insurance Regulatory and Development Authority Act Act, 1999 established the Insurance Regulatory and Development Authority of India (IRDAI) to regulate, promote, and ensure orderly growth of the insurance sector. It empowers IRDAI to license entities, protect policyholders, oversee operations, and amend existing insurance laws, ensuring transparency, accountability, and development within the insurance industry.")
descriptions.append("The Motor Vehicles Act, 1988 regulates all aspects of road transport in India, including licensing, registration, permits, traffic control, insurance, liability, and penalties. It ensures road safety, sets standards for drivers and vehicles, and establishes legal frameworks for compensation, offences, and enforcement by authorities at both state and central levels.")

def query_engine():
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
            metadata = ToolMetadata(name = names[n], description = descriptions[n])
        ))

    query_engine = SubQuestionQueryEngine.from_defaults(query_engine_tools=query_engine_tools, use_async=True)

    return query_engine
    
agent = client.agents.create(
    name="Legal-QA Assistant",
    model="gpt-4o",
    about="""You are a knowledgeable Legal Assistant AI, built to offer general legal information and guidance across various issues—not a replacement for professional legal advice. Your role is to help users understand their situations and make informed decisions about seeking legal counsel.

When a user presents a legal query:

1. Understand the Situation:
Analyze key facts, legal issues, and principles. Ask for clarification or missing details as needed.

2. Provide Information and Guidance:

Legal Issues: Summarize the core issues in simple terms.

Suggested Action: Recommend next steps, but always preface with:
“This is for informational purposes only. Please consult with a qualified attorney about your specific legal situation.”

Potential Complications: Highlight risks, liabilities, defenses, or time limits.

Next Steps: Offer clear, actionable advice (e.g., consult attorney, gather evidence, file report).

Resources: Share relevant laws, cases, or articles when helpful.

3. Emphasize Limitations:
Reinforce that you're not a lawyer. Warn users not to rely solely on your info, and always urge consultation with a qualified attorney.

4. Ethics:

Keep user data confidential.

Don't judge users or give advice without enough context.

Never accept or request payment.

Interaction Style:
Communicate clearly and simply, avoid jargon, be empathetic, and review responses for clarity and accuracy.

Example Format:
"As an AI legal assistant, this information cannot replace legal advice: Please consult with a qualified attorney. Based on your query (paraphrase), here's what I can tell you:

Legal Issues: ...

Best Course of Action: ...

Potential Complications: ...

Next Steps: ...

Resources: ..."

Ready for legal queries.""",

    metadata={
        "expertise": "Legal-QA",
        "language": "english"
    }
)

tools = client.agents.tools.create(
    agent_id=agent.id,
    name="query_engine",
    type="function",
    function={
        "description": "Useful for when you want to answer questions. The input to this tool should be a complete English sentence. Works best if you redirect the entire query back into this. This is an AI Assistant, ask complete questions, articulate well.",
        "parameters": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "Question asked in the query."
                }
            },
            "required": ["question"]
        }
    }
)


# Setup session once
session = client.sessions.create(
    agent=agent.id,
    situation="User wants to have legal acts related question",
)

# Maintain full chat history
chat_history = []

print("Legal Assistant is ready. Type 'exit' to end.\n")

while True:
    user_input = input("You: ")

    if user_input.lower() in ["exit", "quit"]:
        print("Session ended.")
        break

    chat_history.append({"role": "user", "content": user_input})

    response = client.sessions.chat(
        session_id=session.id,
        messages=chat_history
    )

    assistant_message = response.choices[0].message.content #if hasattr(response, "content") else response["content"]
    print(f"\nLegal Assistant: {assistant_message}\n")

    chat_history.append({"role": "assistant", "content": assistant_message})

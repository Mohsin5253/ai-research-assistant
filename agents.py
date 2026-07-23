from langgraph.prebuilt import create_react_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search , scrape_url 
import os
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY", "dummy_key")

# Primary: llama-3.3-70b-versatile (best quality on Groq)
primary_llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0, api_key=api_key)
# Fallback: mixtral-8x7b-32768 (separate token bucket, 32k context)
fallback_llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0, api_key=api_key)

llm = primary_llm.with_fallbacks([fallback_llm])


#1st agent 
def build_search_agent():
    return create_react_agent(
        model = llm,
        tools= [web_search]
    )

#2nd agent 

def build_reader_agent():
    return create_react_agent(
        model = llm,
        tools = [scrape_url]
    )


#writer chain 

writer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite, world-class research analyst and expert writer. Your task is to produce a deeply comprehensive, multi-section research report that explores the topic exhaustively. 
    
Requirements:
1. MAX LEVEL DEPTH: Synthesize all information deeply. Do not just summarize; analyze, correlate, and find non-obvious insights.
2. MASSIVE LENGTH: Aim for 2000+ words. The report must be extremely detailed.
3. ACADEMIC TONE: Maintain a highly professional, objective, and academic tone.
4. FORMATTING: Use markdown extensively. Use nested bullet points, bold text, and clear headings.
5. DO NOT STOP EARLY: You must complete all sections including the Conclusion and Sources. Do not truncate the report.
"""),
    ("human", """Write an exhaustive deep-dive research report on the topic below.

Topic: {topic}

Extensive Research Gathered:
{research}

Structure the report exactly like this:
- **Executive Summary**: High-level overview of the most critical findings.
- **Deep Dive & Core Mechanics**: Detailed explanation of how this works, the background, and the fundamental concepts.
- **Key Findings & Evidence**: Minimum 5 extensive, well-explained points with nuances, data, and evidence extracted from the research.
- **Economic, Societal, or Industry Implications**: How does this impact the broader world?
- **Future Outlook & Predictions**: Where is this heading in the next 5-10 years?
- **Conclusion**: (CRITICAL) You MUST provide a final conclusion summarizing all synthesizing thoughts. Do not end abruptly without a conclusion.
- **Sources**: List all URLs found in the research as clickable markdown links, e.g., [Source Title](URL).

Be incredibly detailed, factual, and thorough. Leave no stone unturned. You must output the entire report in a single response, ending with the Sources."""),
])

writer_chain = writer_prompt | llm | StrOutputParser()

refiner_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite research analyst with perfect memory. Your task is to refine and update an existing research report based on a user's follow-up prompt.
You have access to a "Memory Ledger" containing the entire chat history. You MUST NEVER forget established facts, user preferences, or prior instructions from the history.
"""),
    ("human", """You are provided with an existing research report and the chat history (Memory Ledger).
The user has a new follow-up request to modify, expand, or adjust the report.

Memory Ledger (Past Context):
{history}

Existing Report:
{report}

User's New Request:
{prompt}

Rewrite the research report to seamlessly integrate the user's new request while maintaining the exhaustive depth (2000+ words), formatting, and professional tone of the original report. 
CRITICAL: Synthesize the new request WITH your perfect memory of the history. Ensure any requested additions or modifications are thoroughly addressed without losing the core quality of the report."""),
])

refiner_chain = refiner_prompt | llm | StrOutputParser()

#critic_chain 

critic_prompt = ChatPromptTemplate.from_messages([
     ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""),
])

critic_chain = critic_prompt | llm | StrOutputParser()
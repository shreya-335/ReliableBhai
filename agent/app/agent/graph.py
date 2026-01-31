import os
from typing import Literal

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from app.agent.state import AgentState
from app.agent.tools import ALL_TOOLS
from app.schemas.output import AgentOutput # Your Pydantic Model

# --- 1. SETUP THE MODELS ---

# The "Investigator" Model (Has access to tools)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# The "Formatter" Model (Strict JSON enforcer)
# We use a separate instance to ensure clean formatting logic
formatter_llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)

# Bind tools to the investigator
llm_with_tools = llm.bind_tools(ALL_TOOLS)

# --- 2. DEFINE THE SYSTEM PROMPT ---

SYSTEM_PROMPT = """You are an Expert Site Reliability Engineer (SRE) Agent for a Headless E-commerce Platform.
Your goal is to investigate alerts, identify the ROOT CAUSE, and propose a safe remediation.

**YOUR INVESTIGATION PROTOCOL:**
1. ANALYZE the input trigger. Look for patterns (e.g., "401 Error", "Checkout Failed").
2. GATHER EVIDENCE using your tools. 
   - Always check logs (`fetch_granular_logs`) to see the real error.
   - Check if the merchant changed something recently (`fetch_migration_diff`).
   - Consult the manual (`search_api_docs`) or past cases (`search_resolution_history`).
3. TRIANGULATE. If the logs say "Missing Token" and the docs say "Token Required for V2", and the user just migrated to V2 -> That is the root cause.
4. DECIDE. Once you are confident (or stuck), stop calling tools and provide your final analysis.

**RULES:**
- Do not guess. If you need more info, use a tool.
- If the risk is high (e.g., "Rollback"), flag it in your reasoning.
- Be concise.
"""

# --- 3. DEFINE THE NODES ---

def investigator_node(state: AgentState):
    """
    The main reasoning loop. Decides whether to call a tool or end the investigation.
    """
    # Create the prompt with history
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
    ])
    
    chain = prompt | llm_with_tools
    result = chain.invoke(state)
    
    return {"messages": [result]}

def formatter_node(state: AgentState):
    """
    Takes the conversation history and forces it into the strict 'AgentOutput' JSON structure.
    """
    messages = state["messages"]
    
    # We instruct the model to summarize the entire investigation into the Schema
    formatting_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Data Extractor. detailed summary of the SRE investigation above."),
        ("human", "Based on the conversation history, populate the following fields accurately: \n"
                  "- input_signals: Summarize what triggered the alert and what logs were found.\n"
                  "- agent_reasoning: Provide the step-by-step trace and final root cause.\n"
                  "- action_plan: Define the best remediation step.\n"
                  "- merchant_context: Extract merchant details.\n\n"
                  "Ensure the 'confidence_score' reflects how strong the evidence was."),
        MessagesPlaceholder(variable_name="messages"),
    ])
    
    # .with_structured_output is the Magic: It forces the Pydantic schema
    structured_llm = formatter_llm.with_structured_output(AgentOutput)
    chain = formatting_prompt | structured_llm
    
    final_json = chain.invoke(messages)
    
    # Save to state
    return {"final_output": final_json.dict()}

# --- 4. DEFINE THE EDGES ---

def should_continue(state: AgentState) -> Literal["tools", "formatter"]:
    """
    Condition: If the LLM returned a tool call, go to 'tools'.
    If the LLM returned text (meaning it's done), go to 'formatter'.
    """
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    return "formatter"

# --- 5. BUILD THE GRAPH ---

workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("investigator", investigator_node)
workflow.add_node("tools", ToolNode(ALL_TOOLS))
workflow.add_node("formatter", formatter_node)

# Add Entry Point
workflow.set_entry_point("investigator")

# Add Conditional Edge (The Loop)
workflow.add_conditional_edges(
    "investigator",
    should_continue,
    {
        "tools": "tools",
        "formatter": "formatter"
    }
)

# Add Edge back from Tools to Investigator
workflow.add_edge("tools", "investigator")

# Add Edge to End
workflow.add_edge("formatter", END)

# Compile
app = workflow.compile()
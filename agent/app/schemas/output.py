from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AgentReasoning(BaseModel):
    trace: List[str] = Field(description="Step-by-step reasoning logs")
    root_cause: str = Field(description="The identified technical root cause")
    confidence_score: float = Field(description="Confidence (0-1) in the diagnosis")

class ActionPlan(BaseModel):
    type: str = Field(description="Action type: send_email, escalate_slack, etc.")
    risk_level: str = Field(description="LOW, MEDIUM, or HIGH")
    risk_reason: str = Field(description="Why this risk level was assigned")
    
    # --- ADDED FIELD ---
    confidence_score: float = Field(description="Confidence (0-1) that this action is the correct fix")
    
    content: Dict[str, str] = Field(description="The content of the email or ticket")
    tools_required: List[str] = Field(description="List of external tools needed to execute this")

class AgentOutput(BaseModel):
    ticket_id: str
    merchant_context: Dict[str, str]
    input_signals: Dict[str, Any]
    agent_reasoning: AgentReasoning
    action_plan: ActionPlan
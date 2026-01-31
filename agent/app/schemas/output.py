from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AgentReasoning(BaseModel):
    trace: List[str]
    root_cause: str
    confidence_score: float

class ActionPlan(BaseModel):
    type: str  # e.g., "send_email", "escalate_slack"
    risk_level: str # "LOW", "MEDIUM", "HIGH"
    risk_reason: str
    content: Dict[str, str] # {"subject": "...", "body": "..."}
    tools_required: List[str]

class AgentOutput(BaseModel):
    ticket_id: str
    merchant_context: Dict[str, str]
    input_signals: Dict[str, Any]
    agent_reasoning: AgentReasoning
    action_plan: ActionPlan
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- Sub-Models ---

class TriggerInfo(BaseModel):
    trigger_id: str
    trigger_type: str
    trigger_reason: str
    detected_at: str
    time_window_minutes: int

class SummaryInfo(BaseModel):
    event_type: str
    affected_merchants_count: int
    event_count: int
    trend: str

class EventContext(BaseModel):
    error_code: Optional[str] = None
    checkout_mode: Optional[str] = None
    ticket_category: Optional[str] = None
    ticket_priority: Optional[str] = None

class CorrelatedEvent(BaseModel):
    event_id: str
    event_type: str
    merchant_id: str
    timestamp: str
    source: str
    context: EventContext

class MerchantContext(BaseModel):
    migration_stage: str
    stage_updated_at: str

# --- Main Input Payload ---

class AgentTriggerPayload(BaseModel):
    trigger: TriggerInfo
    summary: SummaryInfo
    correlated_events: List[CorrelatedEvent]
    merchant_context: Dict[str, MerchantContext]
    related_human_signals: List[CorrelatedEvent] = []
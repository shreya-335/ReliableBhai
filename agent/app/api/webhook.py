from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas.payload import AgentTriggerPayload
from app.agent.graph import app as agent_graph # Importing the compiled LangGraph
from typing import Dict, Any

router = APIRouter()

@router.post("/trigger", status_code=202)
async def trigger_agent(payload: AgentTriggerPayload):
    """
    Webhook Entry Point.
    Receives the 'Pattern Detected' payload and starts the Agentic workflow.
    """
    
    # 1. Convert Pydantic model to a clean Dict for the Agent
    input_data = payload.model_dump()
    
    # 2. Extract key info to prime the agent's context
    # We create the initial state message.
    trigger_summary = (
        f"Trigger: {input_data['trigger']['trigger_type']}\n"
        f"Summary: {input_data['summary']['event_count']} events of type "
        f"{input_data['summary']['event_type']} detected across "
        f"{input_data['summary']['affected_merchants_count']} merchants."
    )
    
    # 3. Invoke the Agent (Synchronous for MVP demo purposes)
    # In production, this would be a background task (Celery/Arq).
    try:
        initial_state = {
            "messages": [
                ("user", f"Here is the incident report:\n{trigger_summary}\n\n"
                         f"Full Payload Context: {input_data}\n\n"
                         "Investigate the root cause using your tools.")
            ]
        }
        
        # Invoke the graph
        result = agent_graph.invoke(initial_state)
        
        # --- THE FIX IS HERE ---
        # OLD INCORRECT WAY: final_response = result["messages"][-1].content
        
        # NEW CORRECT WAY: Read the structured object from the state key
        final_output = result.get("final_output")
        
        if not final_output:
            # Fallback if the graph failed to reach the formatter node
            return {
                "status": "error", 
                "message": "Agent failed to produce structured output",
                "trace": [m.content for m in result["messages"]]
            }
        
        return {
            "status": "success",
            "agent_analysis": final_output, # This returns the pure JSON object
            "run_id": input_data['trigger']['trigger_id']
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
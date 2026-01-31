import json
import os
from langchain_core.tools import tool
from app.db import get_db_connection

# --- CONFIGURATION ---
KB_FILE_PATH = os.path.join(os.path.dirname(__file__), "../../data/knowledge_base.json")

# --- HELPER: Load JSON Docs ---
def load_local_kb():
    """Loads the static API documentation from the JSON file."""
    try:
        with open(KB_FILE_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Knowledge base file not found."}

# --- TOOL 1: The Microscope (Granular Logs) ---
@tool
def fetch_granular_logs(event_id: str) -> str:
    """
    Fetches the specific technical details (stack traces, headers, bodies) 
    for a given event ID by querying the central Event table.
    """
    conn = get_db_connection()
    if not conn:
        return "Database unavailable."
    
    try:
        with conn.cursor() as cur:
            query = """
                SELECT "eventType", "context", "technicalDetails", "occurredAt"
                FROM "Event" 
                WHERE "eventId" = %s
            """
            cur.execute(query, (event_id,))
            result = cur.fetchone()
            
            if result:
                return json.dumps({
                    "event_type": result["eventType"],
                    "timestamp": result["occurredAt"].isoformat(),
                    "context": result["context"],
                    "technical_details": result["technicalDetails"]
                }, indent=2, default=str)
                
        return f"No granular logs found for event ID: {event_id}"
    except Exception as e:
        return f"Query failed: {str(e)}"
    finally:
        conn.close()

# --- TOOL 2: The Time Machine (Migration Context) ---
@tool
def fetch_migration_diff(merchant_id: str) -> str:
    """
    Retrieves the merchant's current migration stage and the most recent 
    'migration_stage_updated' event to understand what changed.
    """
    conn = get_db_connection()
    if not conn:
        return "Database unavailable."

    try:
        with conn.cursor() as cur:
            state_query = 'SELECT "currentStage", "updatedAt" FROM "MigrationState" WHERE "merchantId" = %s'
            cur.execute(state_query, (merchant_id,))
            current_state = cur.fetchone()

            event_query = """
                SELECT "context", "technicalDetails"
                FROM "Event"
                WHERE "merchantId" = %s AND "eventType" = 'migration_stage_updated'
                ORDER BY "occurredAt" DESC
                LIMIT 1
            """
            cur.execute(event_query, (merchant_id,))
            last_event = cur.fetchone()
            
            response = {
                "merchant_id": merchant_id,
                "current_status": current_state if current_state else "Unknown",
                "last_change_event": last_event if last_event else "No migration history found"
            }
            return json.dumps(response, indent=2, default=str)
    finally:
        conn.close()

# --- TOOL 3: The Manual (Official API Docs - JSON) ---
@tool
def search_api_docs(query: str) -> str:
    """
    Searches the OFFICIAL API documentation (JSON) for definitions,
    endpoint usage, and standard error codes.
    Use this to understand 'how it is supposed to work'.
    """
    kb_data = load_local_kb()
    if "error" in kb_data:
        return kb_data["error"]
    
    query = query.upper()
    troubleshooting = kb_data.get("troubleshooting_guide", {})
    
    # Direct Hit
    if query in troubleshooting:
        return json.dumps(troubleshooting[query], indent=2)
    
    # Keyword Search
    matches = []
    for key, val in troubleshooting.items():
        if query in key or query in str(val):
            matches.append(val)
            
    if matches:
        return json.dumps(matches[:2], indent=2)
        
    return "No specific documentation found in the JSON API Docs."

# --- TOOL 4: Institutional Memory (Internal SQL Resolutions) ---
@tool
def search_resolution_history(query: str) -> str:
    """
    Searches the internal 'KnowledgeBase' database of PAST RESOLUTIONS.
    Use this to find how we fixed similar specific error codes or symptoms before.
    Useful for 'tribal knowledge' that isn't in the official docs yet.
    """
    conn = get_db_connection()
    if not conn:
        return "Database unavailable."

    try:
        with conn.cursor() as cur:
            # We search by exact Error Code OR fuzzy match on the Symptom description
            sql_query = """
                SELECT "errorCode", "rootCause", "resolution", "relatedStage"
                FROM "KnowledgeBase"
                WHERE "errorCode" = %s OR "symptom" ILIKE %s
                LIMIT 3
            """
            # Prepare fuzzy search term (e.g., %timeout%)
            fuzzy_term = f"%{query}%"
            
            cur.execute(sql_query, (query, fuzzy_term))
            results = cur.fetchall()
            
            if results:
                return json.dumps([dict(row) for row in results], indent=2)
            
            return f"No past resolutions found in the internal database for: {query}"
    finally:
        conn.close()

# --- TOOL 5: Platform Health (Mocked) ---
@tool
def check_platform_health(service_name: str) -> str:
    """Checks the real-time health status of internal platform services."""
    return json.dumps({
        "service": service_name,
        "status": "OPERATIONAL",
        "uptime": "99.99%"
    })

# --- TOOL 6: The Voice of Customer (Ticket Content) ---
@tool
def fetch_ticket_content(event_id: str) -> str:
    """Retrieves the actual text content of a support ticket."""
    conn = get_db_connection()
    if not conn:
        return "Database unavailable."
    
    try:
        with conn.cursor() as cur:
            query = """
                SELECT "technicalDetails" 
                FROM "Event" 
                WHERE "eventId" = %s AND "eventType" = 'ticket_created'
            """
            cur.execute(query, (event_id,))
            result = cur.fetchone()
            
            if result:
                return f"Ticket Details: {json.dumps(result['technicalDetails'], default=str)}"
                
        return f"Ticket content not found for ID: {event_id}"
    finally:
        conn.close()

# Export list for the Agent
ALL_TOOLS = [
    fetch_granular_logs, 
    fetch_migration_diff, 
    search_api_docs,           # The "Theory" (JSON)
    search_resolution_history, # The "Practice" (SQL)
    check_platform_health, 
    fetch_ticket_content
]
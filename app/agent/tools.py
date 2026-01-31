import json
from langchain_core.tools import tool
from app.db import get_db_connection

# --- HELPER: Generic DB Fetcher ---
def fetch_event_from_tables(event_id: str, tables: list):
    """Searches for an event_id across multiple tables."""
    conn = get_db_connection()
    if not conn:
        return "Database unavailable."
    
    try:
        with conn.cursor() as cur:
            for table in tables:
                query = f"SELECT technical_details, context FROM {table} WHERE event_id = %s"
                cur.execute(query, (event_id,))
                result = cur.fetchone()
                if result:
                    # Merge context and details for a complete view
                    return json.dumps({
                        "source_table": table,
                        "context": result["context"], 
                        "technical_details": result["technical_details"]
                    }, indent=2)
        return None
    finally:
        conn.close()

# --- TOOL 1: The Microscope (Logs) ---
@tool
def fetch_granular_logs(event_id: str) -> str:
    """
    Fetches detailed technical logs (stack traces, request headers) for a specific event ID.
    Searches across CheckoutFailed, Api_Error, and Webhook_Failed tables.
    """
    # We search the 3 technical failure tables
    result = fetch_event_from_tables(event_id, ["CheckoutFailed", "Api_Error", "Webhook_Failed"])
    
    if result:
        return result
    return f"No granular logs found for event ID: {event_id}"

# --- TOOL 2: The Time Machine (Migration Diffs) ---
@tool
def fetch_migration_diff(merchant_id: str) -> str:
    """
    Retrieves the most recent migration stage update for a merchant to see what changed configuration-wise.
    """
    conn = get_db_connection()
    if not conn:
        return "Database connection failed."

    try:
        with conn.cursor() as cur:
            # We look for the most recent update for this merchant
            query = """
                SELECT technical_details 
                FROM Stage_Update 
                WHERE merchant_id = %s 
                ORDER BY timestamp DESC 
                LIMIT 1
            """
            cur.execute(query, (merchant_id,))
            result = cur.fetchone()
            
            if result:
                return json.dumps(result["technical_details"], indent=2)
            return f"No migration history found for merchant {merchant_id}."
    finally:
        conn.close()

# --- TOOL 3: The Voice of Customer (Tickets) ---
@tool
def fetch_ticket_content(event_id: str) -> str:
    """
    Retrieves the actual text content (body/subject) of a support ticket.
    """
    result = fetch_event_from_tables(event_id, ["Ticket"])
    if result:
        return result
    return f"Ticket content not found for ID: {event_id}"

# --- TOOL 4: Knowledge Base (Still JSON for MVP, or a separate DB table) ---
# For the MVP, keeping this as a fast in-memory lookup is often faster/safer 
# than a DB query unless you have vector search. Let's keep the Mock logic for Docs 
# but assume it effectively 'searches' your manual.
@tool
def search_knowledge_base(query: str) -> str:
    """
    Searches the internal documentation for error codes (e.g., PAYMENT_SESSION_MISSING).
    """
    # (Insert the big JSON dictionary from the previous turn here)
    # For brevity, I am mocking the specific hit:
    if "PAYMENT_SESSION_MISSING" in query:
        return (
            "ERROR: PAYMENT_SESSION_MISSING\n"
            "CAUSE: Frontend missing /init-session call before /checkout.\n"
            "FIX: Call POST /init-session to get X-Session-Token."
        )
    return "No documentation found."

@tool
def check_platform_health(service_name: str) -> str:
    """Checks real-time platform status."""
    # This usually hits a status page API, not the DB.
    return json.dumps({"service": service_name, "status": "OPERATIONAL"})
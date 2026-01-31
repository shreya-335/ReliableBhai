export const dashboardData = {
  "system_health": {
    "status": "degraded",
    "active_clusters": ["Stripe V2 Webhook Failures", "Inventory Sync Latency"],
    "auto_resolve_rate": "65%",
    "migration_health": "Degraded",
    "resolved_count": 15,
    "escalated_count": 4
  },
  "tickets": [
    {
      "id": "T-1024",
      "merchant": "StyleHub Inc.",
      "summary": "Checkout failing with 401 Error",
      "category": "Migration Configuration",
      "migration_stage": "Step 3 (API Switch)",
      "agent_analysis": {
        "confidence_score": 0.92,
        "risk_level": "LOW",
        "proposed_action_type": "guidance_email"
      },
      "status": "awaiting_approval",
      "timestamp": "2023-10-27T10:30:00Z"
    },
    {
      "id": "T-1025",
      "merchant": "TechGear Ltd.",
      "summary": "Order webhooks not firing",
      "category": "Platform Regression",
      "migration_stage": "Completed",
      "agent_analysis": {
        "confidence_score": 0.85,
        "risk_level": "HIGH",
        "proposed_action_type": "engineering_escalation"
      },
      "status": "investigating",
      "timestamp": "2023-10-27T10:35:00Z"
    }
  ]
};



export const ticketDetail = {
  "ticket_id": "T-1024",
  "merchant_context": {
    "name": "StyleHub Inc.",
    "migration_status": "Step 3 (API Switch)",
    "tech_stack": "Next.js Frontend / Shopify Backend",
    "tier": "Enterprise"
  },
  "input_signals": {
    "user_message": "Our customers are seeing a 'Network Error' when clicking pay.",
    "system_logs": [
      {
        "timestamp": "10:30:01",
        "level": "ERROR",
        "message": "401 Unauthorized: Invalid Bearer Token on /v2/checkout"
      }
    ]
  },
  "agent_reasoning": {
    "trace": [
      "Identified keywords: 'Network Error', 'Pay'",
      "Queried Logs: Found 401 Unauthorized errors coinciding with ticket time.",
      "Comparison: User is on Migration Step 3, which requires V2 tokens.",
      "Diagnosis: Merchant has not swapped their V1 Basic Auth for V2 Bearer Token."
    ],
    "root_cause": "Misconfiguration: Outdated API Credentials",
    "confidence_score": 0.92
  },
  "action_plan": {
    "type": "send_email",
    "risk_level": "LOW",
    "risk_reason": "Action is informational only. Does not modify infrastructure.",
    "content": {
      "subject": "Action Required: Update your API Credentials for V2",
      "body": "Hi Naitik,\n\nWe detected 401 errors. It looks like your frontend is still using the old V1 keys. Please update your Bearer token in the settings panel."
    },
    "tools_required": ["email_service", "doc_linker"]
  }
};
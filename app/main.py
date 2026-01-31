from fastapi import FastAPI
from app.api.webhook import router as webhook_router

app = FastAPI(title="SRE Agent Backend")

# Include the router
app.include_router(webhook_router, prefix="/api/v1/webhook")

@app.get("/health")
def health_check():
    return {"status": "ok", "db": "connected"}
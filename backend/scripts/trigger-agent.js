// scripts/trigger-agent.js

const BASE_URL = "http://localhost:3000/events/checkout-failed";

async function sendEvent(merchantId, eventId) {
  const payload = {
    event_id: eventId,
    occurred_at: new Date().toISOString(), // CRITICAL
    merchant_id: merchantId,
    error_code: "PAYMENT_SESSION_MISSING",
    checkout_mode: "headless",
    transaction_amount: 120.5,
    currency: "USD",
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log(`✅ Sent event for ${merchantId}:`, data);
}

async function main() {
  console.log("🚀 Triggering multi-merchant checkout failure…");

  await sendEvent("_merchantdemo120", "_evtdemo120");
//   await sendEvent("_merchantdemo08", "_evtdemo08");
//   await sendEvent("_merchantdemo09", "_evtdemo09");

  console.log("🎯 Done. Agent trigger should now exist.");
}

main().catch(console.error);
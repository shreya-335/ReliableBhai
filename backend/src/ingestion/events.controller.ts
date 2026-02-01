// src/ingestion/events.controller.ts

import type { Request, Response } from "express";
import { Router } from "express";

import {
  normalizeSupportTicket,
  normalizeCheckoutFailed,
  normalizeApiError,
  normalizeWebhookFailed,
  normalizeMigrationStage,
} from "./normalize.js";

import { eventRepository } from "../store/event.repository.js";
import { migrationRepository } from "../store/migration.repository.js";
import { triggerEngine } from "../correlation/trigger.engine.js";

// Router instance
const router = Router();

/**
 * Helper to handle ingestion flow:
 * normalize -> persist -> (fire correlation) -> respond
 */
async function ingestEvent(
  req: Request,
  res: Response,
  normalizeFn: (raw: any) => any,
  options?: {
    updateMigrationState?: boolean;
  }
) {
  try {
    const normalizedEvent = normalizeFn(req.body);

    // 1️⃣ Persist event
    console.log("NORMALIZED EVENT:", normalizedEvent);
    await eventRepository.insertEvent(normalizedEvent);

    // 2️⃣ Optional side effect: update migration_state
    if (options?.updateMigrationState) {
      await migrationRepository.upsertMigrationStage({
        merchantId: normalizedEvent.merchantId,
        stage: normalizedEvent.context.new_stage,
        updatedAt: normalizedEvent.occurredAt,
      });
    }

    // 3️⃣ Fire correlation engine (NON-BLOCKING)
    triggerEngine.evaluate().catch((err) => {
      console.error("Trigger engine evaluation failed:", err);
    });

    // 4️⃣ Respond immediately
    return res.status(202).json({
      status: "accepted",
      event_type: normalizedEvent.eventType,
      event_id: normalizedEvent.eventId,
    });
  } catch (err: any) {
    return res.status(400).json({
      status: "error",
      message: err.message ?? "Invalid event payload",
    });
  }
}

/**
 * POST /events/support-ticket
 * Human-generated signal
 */
router.post("/support-ticket", async (req, res) => {
  return ingestEvent(req, res, normalizeSupportTicket);
});

/**
 * POST /events/checkout-failed
 * System-generated checkout failure
 */
router.post("/checkout-failed", async (req, res) => {
  return ingestEvent(req, res, normalizeCheckoutFailed);
});

/**
 * POST /events/api-error
 * System-generated API error (e.g. deprecated endpoint)
 */
router.post("/api-error", async (req, res) => {
  return ingestEvent(req, res, normalizeApiError);
});

/**
 * POST /events/webhook-failed
 * System-generated webhook delivery failure
 */
router.post("/webhook-failed", async (req, res) => {
  return ingestEvent(req, res, normalizeWebhookFailed);
});

/**
 * POST /events/migration-stage
 * Migration stage update (special: updates migration_state)
 */
router.post("/migration-stage", async (req, res) => {
  return ingestEvent(req, res, normalizeMigrationStage, {
    updateMigrationState: true,
  });
});

export default router;
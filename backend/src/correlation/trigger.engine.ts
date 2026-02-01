// src/correlation/trigger.engine.ts

import { eventRepository } from "../store/event.repository.js";
import { triggerRepository } from "../store/trigger.repository.js";
import { migrationRepository } from "../store/migration.repository.js";
import { agentClient } from "../agent_client/agent.client.js";

const CORRELATION_WINDOW_MINUTES = 1;
const MULTI_MERCHANT_THRESHOLD = 1;

export class TriggerEngine {
  /**
   * Entry point.
   * Evaluates whether recent events indicate a non-random pattern.
   */
  async evaluate() {
    const now = new Date();
    const windowStart = new Date(
      now.getTime() - CORRELATION_WINDOW_MINUTES * 60 * 1000
    );

    await this.checkMultiMerchantFailure(
      "checkout_failed",
      windowStart,
      now
    );

    await this.checkMultiMerchantFailure("api_error", windowStart, now);
    await this.checkMultiMerchantFailure("webhook_failed", windowStart, now);
  }

  /**
   * Rule: Same error_code across multiple merchants within time window.
   */
  private async checkMultiMerchantFailure(
    eventType: string,
    from: Date,
    to: Date
  ) {
    const events = await eventRepository.getEventsInWindow({
      from,
      to,
      eventType,
    });

    if (events.length === 0) return;

    const groupedByError: Record<
      string,
      { eventIds: string[]; merchants: Set<string> }
    > = {};

    for (const event of events) {
      const errorCode =
        event.context &&
        typeof event.context === "object" &&
        !Array.isArray(event.context)
          ? (event.context as any).error_code
          : undefined;

      if (!errorCode) continue;

      if (!groupedByError[errorCode]) {
        groupedByError[errorCode] = {
          eventIds: [],
          merchants: new Set<string>(),
        };
      }

      groupedByError[errorCode].eventIds.push(event.eventId);
      groupedByError[errorCode].merchants.add(event.merchantId);
    }

    for (const [errorCode, data] of Object.entries(groupedByError)) {
      if (data.merchants.size >= MULTI_MERCHANT_THRESHOLD) {
        await this.createTriggerIfNotExists({
          eventType,
          errorCode,
          eventIds: data.eventIds,
          merchantCount: data.merchants.size,
          from,
          to,
        });
      }
    }
  }

  /**
   * Create trigger only if a similar one does not already exist recently.
   */
  private async createTriggerIfNotExists(params: {
    eventType: string;
    errorCode: string;
    eventIds: string[];
    merchantCount: number;
    from: Date;
    to: Date;
  }) {
    const detectedAt = new Date();

    // 🔒 Dedup guard
    const existingTriggers =
      await triggerRepository.getTriggersForDashboard();

    const duplicate = existingTriggers.find((t) => {
      if (t.triggerType !== "multi_merchant_failure") return false;

      const snapshot = t.payloadSnapshot as any;
      return (
        snapshot?.summary?.event_type === params.eventType &&
        snapshot?.summary?.error_code === params.errorCode &&
        new Date(t.detectedAt).getTime() >
          detectedAt.getTime() -
            CORRELATION_WINDOW_MINUTES * 60 * 1000
      );
    });

    if (duplicate) return;

    /* -----------------------------
       Build correlated_events
    ------------------------------ */
    const correlatedEvents = await eventRepository.getEventsByIds(
      params.eventIds
    );

    const correlatedEventsPayload = correlatedEvents.map((e) => ({
      event_id: e.eventId,
      event_type: e.eventType,
      merchant_id: e.merchantId,
      timestamp: e.occurredAt.toISOString(),
      source: e.source,
      context: e.context,
    }));

    /* -----------------------------
       Build merchant_context
    ------------------------------ */
    const merchantContext: Record<string, any> = {};
    const merchantIds = [
      ...new Set(correlatedEvents.map((e) => e.merchantId)),
    ];

    for (const merchantId of merchantIds) {
      const state = await migrationRepository.getMigrationStage(merchantId);
      merchantContext[merchantId] = {
        migration_stage: state?.currentStage ?? "unknown",
        stage_updated_at: state?.updatedAt
        ? state.updatedAt.toISOString()
        : "unknown",
    };
    }

    /* -----------------------------
       Optional: related human signals
    ------------------------------ */
    const relatedHumanSignals = (
      await eventRepository.getEventsInWindow({
        from: params.from,
        to: params.to,
        eventType: "ticket_created",
      })
    ).map((e) => ({
      event_id: e.eventId,
      merchant_id: e.merchantId,
      timestamp: e.occurredAt.toISOString(),
      context: e.context,
    }));

    /* -----------------------------
       Final agent payload (v1)
    ------------------------------ */
    const agentPayload = {
      trigger: {
        trigger_id: "", // filled after DB insert
        trigger_type: "multi_merchant_failure",
        trigger_reason:
          "Same failure observed across multiple merchants within a short time window.",
        detected_at: detectedAt.toISOString(),
        time_window_minutes: CORRELATION_WINDOW_MINUTES,
      },
      summary: {
        event_type: params.eventType,
        affected_merchants_count: params.merchantCount,
        event_count: params.eventIds.length,
        trend: "unknown",
      },
      correlated_events: correlatedEventsPayload,
      merchant_context: merchantContext,
      related_human_signals: relatedHumanSignals,
    };

    /* -----------------------------
       Persist trigger
    ------------------------------ */
    const trigger = await triggerRepository.createTrigger({
      triggerType: "multi_merchant_failure",
      detectedAt,
      timeWindowMinutes: CORRELATION_WINDOW_MINUTES,
      eventIds: params.eventIds,
      payloadSnapshot: agentPayload,
    });

    // Inject trigger_id now that we have it
    agentPayload.trigger.trigger_id = trigger.id;

    /* -----------------------------
       Fire agent (NON-BLOCKING)
    ------------------------------ */
    agentClient
      .sendTriggerToAgent({
        triggerId: trigger.id,
        payload: agentPayload,
      })
      .catch((err) => {
        console.error("Agent call failed:", err);
      });
  }
}

// Export singleton
export const triggerEngine = new TriggerEngine();
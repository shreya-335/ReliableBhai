// src/api/triggers.controller.ts

import { Router } from "express";
import type {  Request, Response } from "express";
import { triggerRepository } from "../store/trigger.repository.js";

const router = Router();

/**
 * GET /api/triggers
 *
 * Command Center view.
 * Returns a list of detected triggers with agent summary.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const triggers = await triggerRepository.getTriggersForDashboard();

    const response = triggers.map((trigger) => {
      const payload = trigger.payloadSnapshot as any;
      const agent = trigger.agentResponse as any;

      return {
        trigger_id: trigger.id,
        trigger_type: trigger.triggerType,
        detected_at: trigger.detectedAt.toISOString(),
        status: trigger.status,

        // From payloadSnapshot (frozen evidence)
        event_type: payload?.summary?.event_type ?? "unknown",
        affected_merchants:
          payload?.summary?.affected_merchants_count ?? 0,
        event_count: payload?.summary?.event_count ?? 0,

        // From agent response (reasoned output)
        agent_confidence: agent?.agent_confidence ?? null,
        risk_level: agent?.action_plan?.risk_level ?? "unknown",
        decision_label: agent?.decision_label ?? null,
        action_type: agent?.action_plan?.action_type ?? null,
      };
    });

    return res.status(200).json({
      status: "success",
      count: response.length,
      data: response,
    });
  } catch (err: any) {
    console.error("Failed to fetch triggers:", err);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch triggers",
    });
  }
});
/**
 * GET /api/triggers/:id
 *
 * Investigation Workbench view.
 * Returns full evidence, agent reasoning, and action plan.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

if (!id || typeof id !== "string") {
  return res.status(400).json({
    status: "error",
    message: "Invalid trigger id",
  });
}

const trigger = await triggerRepository.getTriggerById(id);

    if (!trigger) {
      return res.status(404).json({
        status: "error",
        message: "Trigger not found",
      });
    }

    const payload = trigger.payloadSnapshot as any;
    const agent = trigger.agentResponse as any;

    return res.status(200).json({
      status: "success",
      data: {
        trigger: {
          trigger_id: trigger.id,
          trigger_type: trigger.triggerType,
          detected_at: trigger.detectedAt.toISOString(),
          time_window_minutes: trigger.timeWindowMinutes,
          status: trigger.status,
        },

        // 🔍 Evidence the agent saw
        input_evidence: {
          summary: payload?.summary ?? {},
          correlated_events: payload?.correlated_events ?? [],
          merchant_context: payload?.merchant_context ?? {},
          related_human_signals: payload?.related_human_signals ?? [],
        },

        // 🧠 Agent reasoning (if available)
        agent_analysis: agent
          ? {
              root_cause:
                agent?.agent_reasoning?.root_cause ??
                agent?.analysis?.root_cause ??
                null,
              confidence:
                agent?.agent_confidence ??
                agent?.analysis?.confidence ??
                null,
              reasoning_trace:
                agent?.agent_reasoning?.trace ??
                agent?.analysis?.reasoning ??
                [],
              error_type:
                agent?.error_type ??
                agent?.agent_reasoning?.error_type ??
                null,
              decision_label: agent?.decision_label ?? null,
            }
          : null,

        // 🎯 Proposed action
        action_plan: agent?.action_plan
          ? {
              action_type: agent.action_plan.action_type,
              risk_level: agent.action_plan.risk_level,
              risk_reason: agent.action_plan.risk_reason,
              content: agent.action_plan.content ?? null,
              tools_required: agent.action_plan.tools_required ?? [],
            }
          : null,
      },
    });
  } catch (err: any) {
    console.error("Failed to fetch trigger:", err);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch trigger",
    });
  }
});
export default router;
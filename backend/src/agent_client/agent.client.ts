// src/agent_client/agent.client.ts

import { triggerRepository } from "../store/trigger.repository.js";

const AGENT_BASE_URL = process.env.AGENT_BASE_URL || "http://10.70.4.15:8000";
const AGENT_TIMEOUT_MS = 60000;

export class AgentClient {
  /**
   * Send a trigger payload to the AI agent and store the response.
   */
  async sendTriggerToAgent(params: {
    triggerId: string;
    payload: Record<string, any>;
  }) {
    const { triggerId, payload } = params;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        AGENT_TIMEOUT_MS
      );
      console.log("sending request to the agent...");
      const response = await fetch(`${AGENT_BASE_URL}/api/v1/webhook/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Agent responded with ${response.status}: ${text}`
        );
      }

      const agentResponse = await response.json();
      console.log("Agent response:", agentResponse);
      // Persist agent response
      await triggerRepository.updateTriggerWithAgentResponse({
        triggerId,
        agentResponse: agentResponse as Record<string, any>,
        status: "awaiting_human_approval",
      });
    } catch (err: any) {
      console.error("Agent client failed:", err.message);

      // Persist failure for auditability
      await triggerRepository.updateTriggerWithAgentResponse({
        triggerId,
        agentResponse: {
          error: err.message ?? "Agent request failed",
        },
        status: "agent_failed",
      });
    }
  }
}

// Export singleton
export const agentClient = new AgentClient();
// src/store/trigger.repository.ts

import { prisma } from "../config/db.js";

export class TriggerRepository {
  /**
   * Create a new agent trigger record.
   * This is called when a correlation rule fires.
   */
  async createTrigger(params: {
    triggerType: string;
    detectedAt: Date;
    timeWindowMinutes: number;
    eventIds: string[];
    payloadSnapshot: Record<string, any>;
    status?: string;
  }) {
    const {
      triggerType,
      detectedAt,
      timeWindowMinutes,
      eventIds,
      payloadSnapshot,
      status = "awaiting_agent_response",
    } = params;

    return prisma.agentTrigger.create({
      data: {
        triggerType,
        detectedAt,
        timeWindowMinutes,
        eventIds,
        payloadSnapshot,
        status,
      },
    });
  }

  /**
   * Update an existing trigger with the agent's response.
   * Called after the AI agent returns analysis.
   */
  async updateTriggerWithAgentResponse(params: {
    triggerId: string;
    agentResponse: Record<string, any>;
    status?: string;
  }) {
    const {
      triggerId,
      agentResponse,
      status = "awaiting_human_approval",
    } = params;

    return prisma.agentTrigger.update({
      where: {
        id: triggerId,
      },
      data: {
        agentResponse,
        status,
      },
    });
  }

  /**
   * Fetch all triggers for the command center dashboard.
   * Sorted by most recent first.
   */
  async getTriggersForDashboard() {
    return prisma.agentTrigger.findMany({
      orderBy: {
        detectedAt: "desc",
      },
    });
  }

  /**
   * Fetch a single trigger by ID.
   * Used for the investigation workbench view.
   */
  async getTriggerById(triggerId: string) {
    return prisma.agentTrigger.findUnique({
      where: {
        id: triggerId,
      },
    });
  }
}

// Export singleton instance
export const triggerRepository = new TriggerRepository();
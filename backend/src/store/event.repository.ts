// src/store/event.repository.ts

import { prisma } from "../config/db.js";
import type { NormalizedEvent } from "../types/event.js";

export class EventRepository {
  /**
   * Insert a normalized event into the events table.
   * Assumes event is already validated and normalized.
   */
  async insertEvent(event: NormalizedEvent) {
    return prisma.event.create({
      data: {
        eventId: event.eventId,
        eventType: event.eventType,
        merchantId: event.merchantId,
        source: event.source,
        occurredAt: event.occurredAt,
        context: event.context,
        technicalDetails: event.technicalDetails,
      },
    });
  }

  /**
   * Fetch events within a time window.
   * Optional filtering by eventType.
   */
  async getEventsInWindow(params: {
    from: Date;
    to: Date;
    eventType?: string;
  }) {
    const { from, to, eventType } = params;

    return prisma.event.findMany({
      where: {
        occurredAt: {
          gte: from,
          lte: to,
        },
        ...(eventType ? { eventType } : {}),
      },
      orderBy: {
        occurredAt: "asc",
      },
    });
  }

  /**
   * Fetch events by a list of eventIds (external IDs).
   * Used when building agent payloads for a trigger.
   */
  async getEventsByIds(eventIds: string[]) {
    if (eventIds.length === 0) {
      return [];
    }

    return prisma.event.findMany({
      where: {
        eventId: {
          in: eventIds,
        },
      },
      orderBy: {
        occurredAt: "asc",
      },
    });
  }

  /**
   * Fetch recent events for a specific merchant.
   * Useful for context building and debugging.
   */
  async getRecentEventsForMerchant(params: {
    merchantId: string;
    limit?: number;
  }) {
    const { merchantId, limit = 20 } = params;

    return prisma.event.findMany({
      where: {
        merchantId,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: limit,
    });
  }
}

// Export a singleton instance (recommended)
export const eventRepository = new EventRepository();
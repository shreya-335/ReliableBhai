// src/ingestion/normalize.ts

import type { NormalizedEvent } from "../types/event.js";

/**
 * Normalize a support platform ticket into a canonical event.
 */
export function normalizeSupportTicket(raw: any): NormalizedEvent {
  if (!raw.ticket_id || !raw.merchant || !raw.created_at) {
    throw new Error("Invalid support ticket payload");
  }

  return {
    eventId: raw.ticket_id,
    eventType: "ticket_created",
    merchantId: raw.merchant,
    source: raw.system ?? "support-platform",
    occurredAt: new Date(raw.created_at),
    context: {
      category: raw.category,
      priority: raw.priority,
    },
    technicalDetails: {
      subject: raw.subject,
      message: raw.message,
    },
  };
}

/**
 * Normalize a checkout failure event.
 */
export function normalizeCheckoutFailed(raw: any): NormalizedEvent {
  if (!raw.event_id || !raw.merchant_id || !raw.occurred_at) {
    throw new Error("Invalid checkout_failed payload");
  }

  return {
    eventId: raw.event_id,
    eventType: "checkout_failed",
    merchantId: raw.merchant_id,
    source: "checkout-service",
    occurredAt: new Date(raw.occurred_at),
    context: {
      error_code: raw.error_code,
      checkout_mode: raw.checkout_mode,
      transaction_amount: raw.transaction_amount,
      currency: raw.currency,
    },
    technicalDetails: {
      request_url: raw.request_url,
      missing_headers: raw.missing_headers,
    },
  };
}

/**
 * Normalize an API error event (e.g. deprecated endpoint usage).
 */
export function normalizeApiError(raw: any): NormalizedEvent {
  if (!raw.event_id || !raw.merchant_id || !raw.occurred_at) {
    throw new Error("Invalid api_error payload");
  }

  return {
    eventId: raw.event_id,
    eventType: "api_error",
    merchantId: raw.merchant_id,
    source: "api-gateway",
    occurredAt: new Date(raw.occurred_at),
    context: {
      error_code: raw.error_code,
      endpoint: raw.endpoint,
      method: raw.method,
      http_status: raw.http_status,
    },
    technicalDetails: {},
  };
}

/**
 * Normalize a webhook delivery failure event.
 */
export function normalizeWebhookFailed(raw: any): NormalizedEvent {
  if (!raw.event_id || !raw.merchant_id || !raw.occurred_at) {
    throw new Error("Invalid webhook_failed payload");
  }

  return {
    eventId: raw.event_id,
    eventType: "webhook_failed",
    merchantId: raw.merchant_id,
    source: "webhook-dispatcher",
    occurredAt: new Date(raw.occurred_at),
    context: {
      error_code: raw.error_code,
      webhook_topic: raw.webhook_topic,
      attempt_count: raw.attempt_count,
      last_response_code: raw.last_response_code,
    },
    technicalDetails: {},
  };
}

/**
 * Normalize a migration stage update event.
 */
export function normalizeMigrationStage(raw: any): NormalizedEvent {
  if (!raw.event_id || !raw.merchant_id || !raw.occurred_at || !raw.new_stage) {
    throw new Error("Invalid migration_stage payload");
  }

  return {
    eventId: raw.event_id,
    eventType: "migration_stage_updated",
    merchantId: raw.merchant_id,
    source: "migration-service",
    occurredAt: new Date(raw.occurred_at),
    context: {
      new_stage: raw.new_stage,
    },
    technicalDetails: {},
  };
}
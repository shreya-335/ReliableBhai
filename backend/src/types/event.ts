export interface NormalizedEvent {
  /**
   * External event identifier (from source system)
   */
  eventId: string;

  /**
   * Canonical event type
   * Examples:
   * - checkout_failed
   * - api_error
   * - ticket_created
   * - webhook_failed
   * - migration_stage_updated
   */
  eventType: string;

  /**
   * Merchant affected by the event
   */
  merchantId: string;

  /**
   * Source system that emitted the event
   * Examples:
   * - checkout-service
   * - api-gateway
   * - support-platform
   */
  source: string;

  /**
   * When the event actually occurred
   */
  occurredAt: Date;

  /**
   * Event-specific structured metadata
   */
  context: Record<string, any>;

  /**
   * Deep technical/debug information (optional but recommended)
   */
  technicalDetails: Record<string, any>;
}
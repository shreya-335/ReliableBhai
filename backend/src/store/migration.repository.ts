// src/store/migration.repository.ts

import { prisma } from "../config/db.js";

export class MigrationRepository {
  /**
   * Upsert the current migration stage for a merchant.
   * This represents the latest known migration state.
   *
   * History of changes is stored separately in the events table.
   */
  async upsertMigrationStage(params: {
    merchantId: string;
    stage: string;
    updatedAt: Date;
  }) {
    const { merchantId, stage, updatedAt } = params;

    return prisma.migrationState.upsert({
      where: {
        merchantId,
      },
      update: {
        currentStage: stage,
        updatedAt,
      },
      create: {
        merchantId,
        currentStage: stage,
        updatedAt,
      },
    });
  }

  /**
   * Fetch the current migration stage for a merchant.
   * Returns null if the merchant has no recorded migration state.
   */
  async getMigrationStage(merchantId: string) {
    return prisma.migrationState.findUnique({
      where: {
        merchantId,
      },
    });
  }
}

// Export singleton instance
export const migrationRepository = new MigrationRepository();
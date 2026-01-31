-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "context" JSONB NOT NULL,
    "technicalDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MigrationState" (
    "merchantId" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MigrationState_pkey" PRIMARY KEY ("merchantId")
);

-- CreateTable
CREATE TABLE "AgentTrigger" (
    "id" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "timeWindowMinutes" INTEGER NOT NULL,
    "eventIds" JSONB NOT NULL,
    "payloadSnapshot" JSONB NOT NULL,
    "agentResponse" JSONB,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeBase" (
    "errorCode" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "relatedStage" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("errorCode")
);

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- CreateIndex
CREATE INDEX "Event_merchantId_idx" ON "Event"("merchantId");

-- CreateIndex
CREATE INDEX "Event_occurredAt_idx" ON "Event"("occurredAt");

-- CreateIndex
CREATE INDEX "Event_eventType_occurredAt_idx" ON "Event"("eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "AgentTrigger_detectedAt_idx" ON "AgentTrigger"("detectedAt");

-- CreateIndex
CREATE INDEX "AgentTrigger_status_idx" ON "AgentTrigger"("status");

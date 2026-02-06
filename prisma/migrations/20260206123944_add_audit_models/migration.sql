-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_VERIFIED', 'VERIFIED', 'NEEDS_ATTENTION');

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedBy" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlAudit" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "projectControlId" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Audit_projectId_idx" ON "Audit"("projectId");

-- CreateIndex
CREATE INDEX "Audit_status_idx" ON "Audit"("status");

-- CreateIndex
CREATE INDEX "ControlAudit_auditId_idx" ON "ControlAudit"("auditId");

-- CreateIndex
CREATE UNIQUE INDEX "ControlAudit_auditId_projectControlId_key" ON "ControlAudit"("auditId", "projectControlId");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlAudit" ADD CONSTRAINT "ControlAudit_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

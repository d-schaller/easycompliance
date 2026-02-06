/*
  Warnings:

  - You are about to drop the column `organizationalMeasures` on the `DPIA` table. All the data in the column will be lost.
  - You are about to drop the column `technicalMeasures` on the `DPIA` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DPIA" DROP COLUMN "organizationalMeasures",
DROP COLUMN "technicalMeasures";

-- CreateTable
CREATE TABLE "OrganizationalMeasure" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" "ImplementationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "responsiblePerson" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "evidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationalMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationalMeasure_projectId_idx" ON "OrganizationalMeasure"("projectId");

-- CreateIndex
CREATE INDEX "OrganizationalMeasure_status_idx" ON "OrganizationalMeasure"("status");

-- AddForeignKey
ALTER TABLE "OrganizationalMeasure" ADD CONSTRAINT "OrganizationalMeasure_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

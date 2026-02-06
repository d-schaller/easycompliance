-- CreateEnum
CREATE TYPE "DPIAStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'REQUIRES_CONSULTATION');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "DPIA" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "DPIAStatus" NOT NULL DEFAULT 'DRAFT',
    "processingDescription" TEXT,
    "dataCategories" TEXT,
    "sensitiveDataTypes" TEXT,
    "dataSubjects" TEXT,
    "estimatedDataSubjects" TEXT,
    "processingPurpose" TEXT,
    "legalBasis" TEXT,
    "technologyDescription" TEXT,
    "preliminaryRiskLevel" "RiskLevel",
    "identifiedRisks" TEXT,
    "technicalMeasures" TEXT,
    "organizationalMeasures" TEXT,
    "dataProtectionByDesign" TEXT,
    "residualRiskLevel" "RiskLevel",
    "residualRiskJustification" TEXT,
    "requiresFDPICConsultation" BOOLEAN NOT NULL DEFAULT false,
    "dpoConsulted" BOOLEAN NOT NULL DEFAULT false,
    "dpoName" TEXT,
    "dpoOpinion" TEXT,
    "fdpicSubmissionDate" TIMESTAMP(3),
    "assessorName" TEXT,
    "assessorRole" TEXT,
    "approvedBy" TEXT,
    "approvalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DPIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DPIA_projectId_key" ON "DPIA"("projectId");

-- AddForeignKey
ALTER TABLE "DPIA" ADD CONSTRAINT "DPIA_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import { z } from "zod";

// Swiss-specific sensitive data types (Art. 5 FADP)
export const SENSITIVE_DATA_TYPES = [
  "health_data",
  "genetic_data",
  "biometric_data",
  "racial_ethnic_origin",
  "political_opinions",
  "religious_philosophical_beliefs",
  "trade_union_membership",
  "criminal_records",
  "social_welfare_data",
] as const;

// Data categories
export const DATA_CATEGORIES = [
  "identification_data",
  "contact_data",
  "financial_data",
  "employment_data",
  "location_data",
  "online_identifiers",
  "behavioral_data",
  "communication_data",
  "image_video_data",
  "other",
] as const;

// Legal basis options (Swiss FADP)
export const LEGAL_BASIS_OPTIONS = [
  "consent",
  "contract_performance",
  "legal_obligation",
  "vital_interests",
  "public_interest",
  "legitimate_interest",
  "statutory_authorization",
] as const;

export const createDPIASchema = z.object({
  // Stage 1 fields are all optional on creation
  processingDescription: z.string().optional(),
  dataCategories: z.array(z.string()).optional(),
  sensitiveDataTypes: z.array(z.string()).optional(),
  dataSubjects: z.string().optional(),
  estimatedDataSubjects: z.string().optional(),
  processingPurpose: z.string().optional(),
  legalBasis: z.string().optional(),
  technologyDescription: z.string().optional(),
  preliminaryRiskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const updateDPIASchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "REQUIRES_CONSULTATION"]).optional(),

  // Stage 1: Preliminary Assessment
  processingDescription: z.string().optional().nullable(),
  dataCategories: z.array(z.string()).optional().nullable(),
  sensitiveDataTypes: z.array(z.string()).optional().nullable(),
  dataSubjects: z.string().optional().nullable(),
  estimatedDataSubjects: z.string().optional().nullable(),
  processingPurpose: z.string().optional().nullable(),
  legalBasis: z.string().optional().nullable(),
  technologyDescription: z.string().optional().nullable(),
  preliminaryRiskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().nullable(),

  // Stage 2: Full Assessment
  identifiedRisks: z.array(z.object({
    description: z.string(),
    likelihood: z.enum(["LOW", "MEDIUM", "HIGH"]),
    impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
    mitigated: z.boolean().optional(),
  })).optional().nullable(),
  dataProtectionByDesign: z.string().optional().nullable(),
  residualRiskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().nullable(),
  residualRiskJustification: z.string().optional().nullable(),

  // Consultation
  requiresFDPICConsultation: z.boolean().optional(),
  dpoConsulted: z.boolean().optional(),
  dpoName: z.string().optional().nullable(),
  dpoOpinion: z.string().optional().nullable(),
  fdpicSubmissionDate: z.string().datetime().optional().nullable(),

  // Metadata
  assessorName: z.string().optional().nullable(),
  assessorRole: z.string().optional().nullable(),
  approvedBy: z.string().optional().nullable(),
  approvalDate: z.string().datetime().optional().nullable(),
});

export type CreateDPIAInput = z.infer<typeof createDPIASchema>;
export type UpdateDPIAInput = z.infer<typeof updateDPIASchema>;

// Helper type for identified risks
export interface IdentifiedRisk {
  description: string;
  likelihood: "LOW" | "MEDIUM" | "HIGH";
  impact: "LOW" | "MEDIUM" | "HIGH";
  mitigated?: boolean;
}

// Labels for display
export const SENSITIVE_DATA_LABELS: Record<string, string> = {
  health_data: "Health data",
  genetic_data: "Genetic data",
  biometric_data: "Biometric data",
  racial_ethnic_origin: "Racial or ethnic origin",
  political_opinions: "Political opinions",
  religious_philosophical_beliefs: "Religious or philosophical beliefs",
  trade_union_membership: "Trade union membership",
  criminal_records: "Criminal records",
  social_welfare_data: "Social welfare data",
};

export const DATA_CATEGORY_LABELS: Record<string, string> = {
  identification_data: "Identification data (name, ID numbers)",
  contact_data: "Contact data (address, email, phone)",
  financial_data: "Financial data (bank accounts, transactions)",
  employment_data: "Employment data (salary, performance)",
  location_data: "Location data (GPS, travel history)",
  online_identifiers: "Online identifiers (IP address, cookies)",
  behavioral_data: "Behavioral data (preferences, habits)",
  communication_data: "Communication data (messages, calls)",
  image_video_data: "Image/video data (photos, recordings)",
  other: "Other data categories",
};

export const LEGAL_BASIS_LABELS: Record<string, string> = {
  consent: "Consent (Art. 6 para. 6 FADP)",
  contract_performance: "Contract performance",
  legal_obligation: "Legal obligation",
  vital_interests: "Vital interests of data subject",
  public_interest: "Public interest",
  legitimate_interest: "Legitimate interest",
  statutory_authorization: "Statutory authorization",
};

export const RISK_LEVEL_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const DPIA_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  REQUIRES_CONSULTATION: "Requires FDPIC Consultation",
};

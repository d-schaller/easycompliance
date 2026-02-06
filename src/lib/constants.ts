// Centralized constants and enums for the application
// These should be the single source of truth for status values

// ===========================================
// Implementation Status (for controls and measures)
// ===========================================

export const IMPLEMENTATION_STATUS = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PARTIALLY_IMPLEMENTED",
  "IMPLEMENTED",
  "NOT_APPLICABLE",
] as const;

export type ImplementationStatus = (typeof IMPLEMENTATION_STATUS)[number];

export const IMPLEMENTATION_STATUS_LABELS: Record<ImplementationStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  PARTIALLY_IMPLEMENTED: "Partially Implemented",
  IMPLEMENTED: "Implemented",
  NOT_APPLICABLE: "Not Applicable",
};

export const IMPLEMENTATION_STATUS_OPTIONS = IMPLEMENTATION_STATUS.map((status) => ({
  value: status,
  label: IMPLEMENTATION_STATUS_LABELS[status],
}));

// ===========================================
// Project Status
// ===========================================

export const PROJECT_STATUS = ["ACTIVE", "ARCHIVED", "COMPLETED"] as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  COMPLETED: "Completed",
};

// ===========================================
// Audit Status
// ===========================================

export const AUDIT_STATUS = ["IN_PROGRESS", "COMPLETED"] as const;

export type AuditStatus = (typeof AUDIT_STATUS)[number];

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

// ===========================================
// Verification Status (for audits)
// ===========================================

export const VERIFICATION_STATUS = ["NOT_VERIFIED", "VERIFIED", "NEEDS_ATTENTION"] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUS)[number];

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  NOT_VERIFIED: "Not Verified",
  VERIFIED: "Verified",
  NEEDS_ATTENTION: "Needs Attention",
};

// ===========================================
// DPIA Status
// ===========================================

export const DPIA_STATUS = ["DRAFT", "IN_REVIEW", "APPROVED", "REQUIRES_CONSULTATION"] as const;

export type DPIAStatus = (typeof DPIA_STATUS)[number];

export const DPIA_STATUS_LABELS: Record<DPIAStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  REQUIRES_CONSULTATION: "Requires FDPIC Consultation",
};

// ===========================================
// Risk Level
// ===========================================

export const RISK_LEVEL = ["LOW", "MEDIUM", "HIGH"] as const;

export type RiskLevel = (typeof RISK_LEVEL)[number];

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// ===========================================
// Organization Role
// ===========================================

export const ORG_ROLE = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const;

export type OrgRole = (typeof ORG_ROLE)[number];

export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
  VIEWER: "Viewer",
};

// ===========================================
// Organizational Measure Categories
// ===========================================

export const MEASURE_CATEGORIES = [
  "policy",
  "training",
  "process",
  "access_control",
  "incident_response",
  "monitoring",
  "vendor_management",
  "documentation",
  "other",
] as const;

export type MeasureCategory = (typeof MEASURE_CATEGORIES)[number];

export const MEASURE_CATEGORY_LABELS: Record<MeasureCategory, string> = {
  policy: "Policy & Governance",
  training: "Training & Awareness",
  process: "Process & Procedure",
  access_control: "Access Control",
  incident_response: "Incident Response",
  monitoring: "Monitoring & Audit",
  vendor_management: "Vendor Management",
  documentation: "Documentation",
  other: "Other",
};

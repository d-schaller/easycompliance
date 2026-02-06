import { z } from "zod";

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

export const MEASURE_CATEGORY_LABELS: Record<string, string> = {
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

export const createOrganizationalMeasureSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().optional(),
  responsiblePerson: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateOrganizationalMeasureSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z
    .enum([
      "NOT_STARTED",
      "IN_PROGRESS",
      "IMPLEMENTED",
      "NOT_APPLICABLE",
      "PARTIALLY_IMPLEMENTED",
    ])
    .optional(),
  responsiblePerson: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  evidence: z.string().optional().nullable(),
});

export type CreateOrganizationalMeasureInput = z.infer<
  typeof createOrganizationalMeasureSchema
>;
export type UpdateOrganizationalMeasureInput = z.infer<
  typeof updateOrganizationalMeasureSchema
>;

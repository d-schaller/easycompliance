import { z } from "zod";

export const VERIFICATION_STATUS = ["NOT_VERIFIED", "VERIFIED", "NEEDS_ATTENTION"] as const;
export const AUDIT_STATUS = ["IN_PROGRESS", "COMPLETED"] as const;

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  NOT_VERIFIED: "Not Verified",
  VERIFIED: "Verified",
  NEEDS_ATTENTION: "Needs Attention",
};

export const startAuditSchema = z.object({
  startedBy: z.string().min(1, "Auditor name is required"),
});

export const updateControlAuditSchema = z.object({
  verificationStatus: z.enum(VERIFICATION_STATUS),
  notes: z.string().optional().nullable(),
});

export const completeAuditSchema = z.object({
  completedBy: z.string().min(1, "Auditor name is required"),
  notes: z.string().optional().nullable(),
});

export type StartAuditInput = z.infer<typeof startAuditSchema>;
export type UpdateControlAuditInput = z.infer<typeof updateControlAuditSchema>;
export type CompleteAuditInput = z.infer<typeof completeAuditSchema>;

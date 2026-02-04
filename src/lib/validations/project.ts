import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]).optional(),
});

export const addControlsToProjectSchema = z.object({
  controlIds: z.array(z.string()).min(1, "At least one control is required"),
});

export const updateProjectControlSchema = z.object({
  implementationStatus: z
    .enum([
      "NOT_STARTED",
      "IN_PROGRESS",
      "IMPLEMENTED",
      "NOT_APPLICABLE",
      "PARTIALLY_IMPLEMENTED",
    ])
    .optional(),
  implementationDescription: z.string().optional().nullable(),
  referenceUrl: z.string().url().optional().nullable().or(z.literal("")),
  implementationNotes: z.string().optional(),
  evidence: z.string().optional(),
  responsiblePerson: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddControlsToProjectInput = z.infer<typeof addControlsToProjectSchema>;
export type UpdateProjectControlInput = z.infer<typeof updateProjectControlSchema>;

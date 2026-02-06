import type { DPIA } from "@prisma/client";

// Fields that are stored as JSON strings in the database
const JSON_FIELDS = ["dataCategories", "sensitiveDataTypes", "identifiedRisks"] as const;

// Fields that are stored as dates
const DATE_FIELDS = ["fdpicSubmissionDate", "approvalDate"] as const;

type JsonField = (typeof JSON_FIELDS)[number];
type DateField = (typeof DATE_FIELDS)[number];

/**
 * Parse a DPIA from database format to API response format.
 * Converts JSON string fields back to arrays/objects.
 */
export function parseDPIA(dpia: DPIA) {
  return {
    ...dpia,
    dataCategories: dpia.dataCategories ? JSON.parse(dpia.dataCategories) : null,
    sensitiveDataTypes: dpia.sensitiveDataTypes ? JSON.parse(dpia.sensitiveDataTypes) : null,
    identifiedRisks: dpia.identifiedRisks ? JSON.parse(dpia.identifiedRisks) : null,
  };
}

/**
 * Prepare DPIA data for database storage.
 * Converts arrays to JSON strings and date strings to Date objects.
 * Only includes fields that are present in the input (for partial updates).
 */
export function prepareDPIAForDB(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    // Handle JSON fields - stringify arrays
    if (JSON_FIELDS.includes(key as JsonField)) {
      result[key] = value ? JSON.stringify(value) : null;
    }
    // Handle date fields - convert strings to Date objects
    else if (DATE_FIELDS.includes(key as DateField)) {
      result[key] = value ? new Date(value as string) : null;
    }
    // Pass through other fields as-is
    else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Extract only defined values from an object.
 * Useful for building partial update objects.
 */
export function extractDefinedValues<T extends Record<string, unknown>>(
  data: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}

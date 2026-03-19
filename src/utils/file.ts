/**
 * File validation and parsing utilities. Single point of access for file handling.
 */

import {
  MAX_PLAN_FILE_BYTES,
  ACCEPTED_PLAN_TYPES,
} from "@/utils/constants";
import type { AcceptedPlanFormat } from "@/types";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a File for upload: type and size.
 */
export function validatePlanFile(file: File): FileValidationResult {
  if (!ACCEPTED_PLAN_TYPES.includes(file.type as AcceptedPlanFormat)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF or plain text file.",
    };
  }
  if (file.size > MAX_PLAN_FILE_BYTES) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 20 MB.",
    };
  }
  return { valid: true };
}

/**
 * Reads a File as base64 for sending to the API.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      if (base64) resolve(base64);
      else reject(new Error("Failed to read file as base64"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

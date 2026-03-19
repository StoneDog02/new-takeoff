/**
 * Shared types for the takeoff application.
 * Single source of truth for domain and API shapes.
 */

/** Plan disciplines we support for takeoff */
export type PlanDiscipline =
  | "residential"
  | "commercial"
  | "landscaping"
  | "electrical"
  | "plumbing"
  | "framing"
  | "hvac"
  | "other";

/** Accepted file types for build plans */
export type AcceptedPlanFormat = "application/pdf" | "text/plain";

/** Upload state for the file uploader */
export type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

/** One line item in a material takeoff */
export interface TakeoffLineItem {
  description: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/** Full takeoff result from the agent */
export interface TakeoffResult {
  discipline: PlanDiscipline;
  summary: string;
  items: TakeoffLineItem[];
  raw?: string;
}

/** API response for /api/takeoff */
export interface TakeoffApiResponse {
  ok: boolean;
  takeoff?: TakeoffResult;
  error?: string;
}

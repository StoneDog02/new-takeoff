/**
 * Application constants. Single place for config and limits.
 */

import type { AcceptedPlanFormat } from "@/types";

export const APP_NAME = "Takeoff";

/** Max file size for plan uploads (bytes) — 20MB to stay under typical API limits */
export const MAX_PLAN_FILE_BYTES = 20 * 1024 * 1024;

/** Allowed MIME types for build plans */
export const ACCEPTED_PLAN_TYPES: AcceptedPlanFormat[] = [
  "application/pdf",
  "text/plain",
];

/** Accept string for file input (extensions + MIME) */
export const ACCEPT_STRING = "application/pdf,.pdf,text/plain,.txt";

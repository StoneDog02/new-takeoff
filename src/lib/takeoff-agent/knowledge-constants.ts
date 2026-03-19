/**
 * Config for the takeoff agent knowledge base. Single place for paths and extensions.
 */

import path from "node:path";

/** Directory name for reference files (relative to project root). */
export const KNOWLEDGE_DIR_NAME = "knowledge";

/** Resolved path to the knowledge directory (project root / knowledge). */
export function getKnowledgeDirPath(): string {
  return path.join(process.cwd(), KNOWLEDGE_DIR_NAME);
}

/** File extensions we include when loading the knowledge base. */
export const KNOWLEDGE_FILE_EXTENSIONS = [".md", ".txt", ".json"] as const;

/**
 * Loads the knowledge base (reference files, rules) and returns a single string
 * to inject into the system prompt. Cached in memory after first load.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  getKnowledgeDirPath,
  KNOWLEDGE_FILE_EXTENSIONS,
} from "./knowledge-constants";

let cachedKnowledge: string | null = null;

/**
 * Returns true if a file has a supported knowledge-base extension.
 */
function isKnowledgeFile(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return (KNOWLEDGE_FILE_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Loads all reference files from the knowledge directory, sorts by filename,
 * and returns one string with clear section headers. Safe to call repeatedly;
 * result is cached. Returns empty string if the directory is missing or empty.
 */
export function loadKnowledgeBase(): string {
  if (cachedKnowledge !== null) {
    return cachedKnowledge;
  }

  const dirPath = getKnowledgeDirPath();
  if (!existsSync(dirPath)) {
    cachedKnowledge = "";
    return "";
  }

  let entries: string[];
  try {
    entries = readdirSync(dirPath, { withFileTypes: true })
      .filter((e) => e.isFile() && isKnowledgeFile(e.name))
      .map((e) => e.name)
      .sort();
  } catch {
    cachedKnowledge = "";
    return "";
  }

  if (entries.length === 0) {
    cachedKnowledge = "";
    return "";
  }

  const sections: string[] = [];
  for (const filename of entries) {
    const filePath = path.join(dirPath, filename);
    try {
      const content = readFileSync(filePath, "utf-8").trim();
      sections.push(`--- Reference: ${filename} ---\n\n${content}`);
    } catch {
      // Skip unreadable files
    }
  }

  cachedKnowledge = sections.join("\n\n");
  return cachedKnowledge;
}

/**
 * Clears the in-memory cache. Useful for tests or when knowledge files change
 * and the server should pick them up without restart (e.g. in dev you could
 * call this on a timer or file watcher).
 */
export function clearKnowledgeCache(): void {
  cachedKnowledge = null;
}

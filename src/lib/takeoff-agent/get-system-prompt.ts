/**
 * Builds the full system prompt: base instructions + knowledge base.
 * Single place that combines prompt.ts and loaded reference files.
 */

import { TAKEOFF_SYSTEM_PROMPT } from "./prompt";
import { loadKnowledgeBase } from "./load-knowledge";

const KNOWLEDGE_HEADER = "\n\n--- Knowledge base (reference files, rules) ---\n\n";

/**
 * Returns the system prompt used for every takeoff request: your main instructions
 * plus the contents of all files in the knowledge/ directory (cached after first load).
 */
export function getSystemPrompt(): string {
  const knowledge = loadKnowledgeBase();
  if (!knowledge) {
    return TAKEOFF_SYSTEM_PROMPT;
  }
  return TAKEOFF_SYSTEM_PROMPT + KNOWLEDGE_HEADER + knowledge;
}

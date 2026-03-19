/**
 * Takeoff agent: single entry point for prompt, knowledge, and client.
 */

export { TAKEOFF_SYSTEM_PROMPT } from "./prompt";
export { getSystemPrompt } from "./get-system-prompt";
export { loadKnowledgeBase, clearKnowledgeCache } from "./load-knowledge";
export { runTakeoff } from "./client";
export type { TakeoffInput } from "./client";

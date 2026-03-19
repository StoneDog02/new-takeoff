/**
 * Anthropic client and takeoff invocation. Single point of access for calling Claude.
 */

import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./get-system-prompt";
import type { TakeoffResult } from "@/types";

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 8192;

/** Get configured Anthropic client (server-side only). */
function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey });
}

export interface TakeoffInput {
  /** Base64-encoded file content */
  contentBase64: string;
  /** MIME type, e.g. application/pdf or text/plain */
  mimeType: string;
  /** Original filename for context */
  filename: string;
}

/**
 * Runs the takeoff agent on the given plan document. Returns structured takeoff or throws.
 */
export async function runTakeoff(input: TakeoffInput): Promise<TakeoffResult> {
  const client = getClient();

  // Document blocks are supported by the Messages API; SDK types may lag.
  const content = [
    {
      type: "document",
      source: {
        type: "base64",
        media_type: input.mimeType as "application/pdf" | "text/plain",
        data: input.contentBase64,
      },
    },
    {
      type: "text",
      text: `Analyze this build plan and produce the material takeoff. Filename: ${input.filename}. Respond with only the JSON object, no other text.`,
    },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: getSystemPrompt(),
    messages: [{ role: "user", content: content as unknown as Anthropic.MessageParam["content"] }],
  });

  const text =
    response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((b) => b.text)
      .join("") || "";

  const parsed = parseTakeoffResponse(text);
  return {
    ...parsed,
    raw: text,
  };
}

function parseTakeoffResponse(text: string): TakeoffResult {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0]! : trimmed;
  try {
    const data = JSON.parse(jsonStr) as TakeoffResult;
    if (
      typeof data.discipline !== "string" ||
      typeof data.summary !== "string" ||
      !Array.isArray(data.items)
    ) {
      return {
        discipline: "other",
        summary: "Invalid response shape from agent.",
        items: [],
        raw: text,
      };
    }
    return {
      discipline: data.discipline,
      summary: data.summary,
      items: data.items.map((item) => ({
        description: String(item.description ?? ""),
        quantity: Number(item.quantity) || 0,
        unit: String(item.unit ?? ""),
        notes: item.notes != null ? String(item.notes) : undefined,
      })),
    };
  } catch {
    return {
      discipline: "other",
      summary: "Could not parse agent response as takeoff.",
      items: [],
      raw: text,
    };
  }
}

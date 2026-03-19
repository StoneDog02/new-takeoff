/**
 * API route: accept plan file upload, run takeoff agent, return structured takeoff.
 * Single endpoint for the takeoff flow.
 */

import { NextRequest, NextResponse } from "next/server";
import { runTakeoff } from "@/lib/takeoff-agent";
import { fileToBase64 } from "@/utils/file";
import { validatePlanFile } from "@/utils/file";
import type { TakeoffApiResponse } from "@/types";
import { ACCEPTED_PLAN_TYPES } from "@/utils/constants";
import type { AcceptedPlanFormat } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse<TakeoffApiResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file provided." },
        { status: 400 }
      );
    }

    const validation = validatePlanFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400 }
      );
    }

    if (!ACCEPTED_PLAN_TYPES.includes(file.type as AcceptedPlanFormat)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported file type." },
        { status: 400 }
      );
    }

    const contentBase64 = await fileToBase64(file);
    const takeoff = await runTakeoff({
      contentBase64,
      mimeType: file.type,
      filename: file.name,
    });

    return NextResponse.json({ ok: true, takeoff });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Takeoff failed.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

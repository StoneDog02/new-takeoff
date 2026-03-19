"use client";

import { useCallback, useState } from "react";
import { FileUploader, TakeoffResultView } from "@/components";
import { APP_NAME } from "@/utils/constants";
import type { TakeoffResult, UploadStatus } from "@/types";

export default function Home() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [takeoff, setTakeoff] = useState<TakeoffResult | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setTakeoff(null);
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.set("file", file);
      setStatus("processing");

      const res = await fetch("/api/takeoff", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }

      if (data.ok && data.takeoff) {
        setTakeoff(data.takeoff);
        setStatus("success");
      } else {
        setStatus("error");
        setError("No takeoff data returned.");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }, []);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setTakeoff(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {APP_NAME}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Upload a build plan — residential, commercial, landscaping,
            electrical, plumbing, framing, HVAC — and get a material takeoff for
            faster bids.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <section className="mb-8">
          <FileUploader
            onFileSelect={handleFileSelect}
            status={status}
            error={error}
            disabled={status === "uploading" || status === "processing"}
          />
          {takeoff && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Upload another plan
              </button>
            </div>
          )}
        </section>

        {takeoff && (
          <section>
            <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
              Material takeoff
            </h2>
            <TakeoffResultView result={takeoff} />
          </section>
        )}
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Open source · Powered by Anthropic Claude
        </div>
      </footer>
    </div>
  );
}

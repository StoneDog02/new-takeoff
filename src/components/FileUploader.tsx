"use client";

import { useCallback, useState } from "react";
import { validatePlanFile } from "@/utils/file";
import type { UploadStatus } from "@/types";
import { ACCEPT_STRING, APP_NAME } from "@/utils/constants";

export interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  status: UploadStatus;
  error: string | null;
  disabled?: boolean;
}

export function FileUploader({
  onFileSelect,
  status,
  error,
  disabled = false,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      setValidationError(null);
      if (!file) return;
      const result = validatePlanFile(file);
      if (!result.valid) {
        setValidationError(result.error ?? "Invalid file");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      handleFile(file ?? null);
    },
    [disabled, handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
      e.target.value = "";
    },
    [handleFile]
  );

  const displayError = error ?? validationError;
  const isBusy = status === "uploading" || status === "processing";

  return (
    <div className="w-full">
      <label
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10
          transition-colors cursor-pointer
          ${disabled || isBusy ? "cursor-not-allowed opacity-60" : ""}
          ${
            dragActive && !disabled
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
          }
        `}
      >
        <input
          type="file"
          accept={ACCEPT_STRING}
          onChange={onChange}
          disabled={disabled || isBusy}
          className="sr-only"
          aria-label={`Upload build plan for ${APP_NAME}`}
        />
        {status === "idle" && (
          <>
            <span className="text-4xl mb-2" aria-hidden>
              📄
            </span>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Drop your build plan here or click to browse
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              PDF or plain text · max 20 MB
            </p>
          </>
        )}
        {(status === "uploading" || status === "processing") && (
          <>
            <span className="text-4xl mb-2 animate-pulse" aria-hidden>
              ⏳
            </span>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {status === "uploading" ? "Uploading…" : "Analyzing plan…"}
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <span className="text-4xl mb-2" aria-hidden>
              ✓
            </span>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Takeoff complete
            </p>
          </>
        )}
      </label>
      {displayError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}

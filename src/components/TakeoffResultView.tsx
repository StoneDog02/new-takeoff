"use client";

import type { TakeoffResult } from "@/types";

export interface TakeoffResultViewProps {
  result: TakeoffResult;
}

export function TakeoffResultView({ result }: TakeoffResultViewProps) {
  const { discipline, summary, items } = result;

  return (
    <section
      className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden"
      aria-label="Takeoff result"
    >
      <header className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {discipline}
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">
          {summary}
        </p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-neutral-400">
                Description
              </th>
              <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-neutral-400 w-24 text-right">
                Qty
              </th>
              <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-neutral-400 w-20">
                Unit
              </th>
              <th className="px-4 py-2.5 font-medium text-neutral-600 dark:text-neutral-400 min-w-[120px]">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400"
                >
                  No line items extracted.
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                >
                  <td className="px-4 py-2.5 text-neutral-800 dark:text-neutral-200">
                    {item.description}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400">
                    {item.unit}
                  </td>
                  <td className="px-4 py-2.5 text-neutral-500 dark:text-neutral-400 text-xs">
                    {item.notes ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

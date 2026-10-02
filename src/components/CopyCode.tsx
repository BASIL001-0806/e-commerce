"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/Icons";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2 transition-colors hover:border-slate-300 hover:bg-slate-50"
      aria-label="Copy order code"
    >
      <span className="font-mono text-[14px] tracking-[0.06em] text-ink">{code}</span>
      <span className="flex items-center gap-1 text-[11.5px] font-medium text-muted">
        {copied ? (
          <span className="flex items-center gap-1 text-good">
            <CheckIcon className="h-3.5 w-3.5" /> Copied
          </span>
        ) : (
          <>
            <CopyIcon className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </span>
    </button>
  );
}

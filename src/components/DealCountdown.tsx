"use client";

import { useEffect, useMemo, useState } from "react";

function endOfDay() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

export function DealCountdown() {
  const target = useMemo(() => endOfDay(), []);
  const [left, setLeft] = useState(() => Math.max(target - Date.now(), 0));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(target - Date.now(), 0)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts = useMemo(() => {
    const total = Math.floor(left / 1000);
    return [
      { label: "hrs", value: Math.floor(total / 3600) },
      { label: "min", value: Math.floor((total % 3600) / 60) },
      { label: "sec", value: total % 60 },
    ];
  }, [left]);

  return (
    <div className="flex items-center gap-1.5">
      {parts.map((p, i) => (
        <div key={p.label} className="flex items-center gap-1.5">
          <div className="flex items-baseline gap-1 rounded-lg bg-[#111827] px-2.5 py-1.5">
            <span className="font-mono text-[16px] font-bold tabular-nums text-white">
              {String(p.value).padStart(2, "0")}
            </span>
            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-gray-400">
              {p.label}
            </span>
          </div>
          {i < parts.length - 1 && <span className="text-[15px] font-bold text-slate-300">:</span>}
        </div>
      ))}
    </div>
  );
}

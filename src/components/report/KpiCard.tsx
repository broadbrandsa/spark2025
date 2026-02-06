import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  changeLine1?: string;
  changeLine2?: string;
  note?: string;
}

export function KpiCard({ label, value, changeLine1 = "—", changeLine2 = "—", note }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[var(--accent-soft)] bg-white p-6 shadow-sm">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <div className="text-3xl font-extrabold text-[var(--text)]">{value}</div>
      <div className="mt-4 flex flex-col">
        <span className="text-xs text-slate-400">{changeLine1}</span>
        <span className="text-xs font-bold text-slate-500">{changeLine2}</span>
        {note ? <span className="mt-1 text-[11px] text-slate-400">{note}</span> : null}
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  label: string;
  metricLabel: string;
  v2025: string;
  v2024: string;
  yoy: string;
  isIncreasePositive?: boolean; // Default true (green if increase). For Spend use false (red if increase)
}

export function ComparisonCard({ label, metricLabel, v2025, v2024, yoy, isIncreasePositive = true }: ComparisonCardProps) {
  const isIncrease = yoy.includes("increase") || yoy.includes("+");
  const isDecrease = yoy.includes("decrease") || yoy.includes("-");

  // Determine color based on intent
  // Increase is Good (Green) if isIncreasePositive is true
  // Increase is Bad (Red) if isIncreasePositive is false
  let yoyColor = "text-slate-500";
  if (isIncrease) {
    yoyColor = isIncreasePositive ? "text-green-600" : "text-red-600";
  } else if (isDecrease) {
    // Decrease is Bad (Red) if isIncreasePositive is true
    // Decrease is Good (Green) if isIncreasePositive is false
    yoyColor = isIncreasePositive ? "text-red-600" : "text-green-600";
  }

  return (
    <div className="flex flex-col rounded-xl bg-white p-6 shadow-sm h-full">
      <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>

      <div className="mb-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">2025 {metricLabel}</p>
        <p className="text-2xl font-extrabold text-slate-900">{v2025}</p>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">2024 {metricLabel}</p>
        <p className="text-xl font-bold text-slate-500">{v2024}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className={`text-sm font-bold ${yoyColor}`}>
          {yoy}
        </p>
      </div>
    </div>
  );
}

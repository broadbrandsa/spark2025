import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  footnote?: string;
}

export function KpiCard({ label, value, footnote }: KpiCardProps) {
  return (
    <div className="rounded border border-gray-200 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {footnote && <p className="mt-2 text-xs text-gray-500">{footnote}</p>}
    </div>
  );
}

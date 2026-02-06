import { ReactNode } from "react";
import { MetricDelta } from "./MetricDelta";

interface KpiCompareCardProps {
  label: string;
  value: ReactNode;
  comparisonValue?: ReactNode;
  deltaAbsolute?: ReactNode;
  comparison?: {
    value: number;
    label?: string;
  };
  footnote?: string;
}

export function KpiCompareCard({
  label,
  value,
  comparisonValue,
  deltaAbsolute,
  comparison,
  footnote,
}: KpiCompareCardProps) {
  return (
    <div className="rounded border border-gray-200 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {comparisonValue && (
        <p className="mt-2 text-xs text-gray-500">Previous: {comparisonValue}</p>
      )}
      {deltaAbsolute && (
        <p className="mt-1 text-xs text-gray-500">Delta (abs): {deltaAbsolute}</p>
      )}
      {comparison && (
        <div className="mt-2">
          <MetricDelta value={comparison.value} />
          {comparison.label && (
            <span className="ml-1 text-xs text-gray-500">{comparison.label}</span>
          )}
        </div>
      )}
      {footnote && <p className="mt-2 text-xs text-gray-500">{footnote}</p>}
    </div>
  );
}

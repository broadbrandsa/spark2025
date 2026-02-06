interface MetricDeltaProps {
  value: number;
  format?: "percent" | "absolute";
}

export function MetricDelta({ value, format = "percent" }: MetricDeltaProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const formatValue = () => {
    const prefix = isPositive ? "+" : "";
    if (format === "percent") {
      return `${prefix}${value.toFixed(1)}%`;
    }
    return `${prefix}${value.toLocaleString()}`;
  };

  // Neutral styling for now - color logic to be added with final designs
  const colorClass = isNeutral ? "text-gray-500" : "text-gray-700";

  return <span className={`text-sm ${colorClass}`}>{formatValue()}</span>;
}

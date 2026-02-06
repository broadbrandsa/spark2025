interface MetricValueProps {
  value: number | string;
  format?: "number" | "percent" | "currency";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function MetricValue({ value, format = "number", size = "md" }: MetricValueProps) {
  const formatValue = () => {
    if (typeof value === "string") return value;

    switch (format) {
      case "percent":
        return `${value.toFixed(1)}%`;
      case "currency":
        return `R${value.toLocaleString()}`;
      case "number":
      default:
        return value.toLocaleString();
    }
  };

  return <span className={`font-semibold ${sizeClasses[size]}`}>{formatValue()}</span>;
}

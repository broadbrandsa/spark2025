"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarConfig {
  dataKey: string;
  label?: string;
  color?: string;
}

interface BarChartBlockProps<T extends object> {
  data: T[];
  bars: BarConfig[];
  title?: string;
  height?: number;
  stacked?: boolean;
  xKey?: string;
}

// Neutral colors for scaffolding - to be replaced with brand colors
const defaultColors = ["#6b7280", "#9ca3af", "#d1d5db", "#374151"];

export function BarChartBlock({
  data,
  bars,
  title,
  height = 300,
  stacked = false,
  xKey = "name",
}: BarChartBlockProps<object>) {
  return (
    <div className="rounded border border-gray-200 p-4">
      {title && <h3 className="mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label || bar.dataKey}
              fill={bar.color || defaultColors[index % defaultColors.length]}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

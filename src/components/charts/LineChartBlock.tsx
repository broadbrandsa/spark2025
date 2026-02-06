"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineConfig {
  dataKey: string;
  label?: string;
  color?: string;
}

interface LineChartBlockProps<T extends object> {
  data: T[];
  lines: LineConfig[];
  title?: string;
  height?: number;
  xKey?: string;
}

// Neutral colors for scaffolding - to be replaced with brand colors
const defaultColors = ["#6b7280", "#9ca3af", "#d1d5db", "#374151"];

export function LineChartBlock({
  data,
  lines,
  title,
  height = 300,
  xKey = "name",
}: LineChartBlockProps<object>) {
  return (
    <div className="rounded border border-gray-200 p-4">
      {title && <h3 className="mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label || line.dataKey}
              stroke={line.color || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

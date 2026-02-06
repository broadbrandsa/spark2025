"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesConfig {
  dataKey: string;
  label: string;
  color: string;
  strokeWidth?: number;
}

interface LineChartPanelProps<T extends object> {
  title: string;
  subtitle?: string;
  data: T[];
  xKey: string;
  series: SeriesConfig[];
}

export function LineChartPanel<T extends object>({
  title,
  subtitle,
  data,
  xKey,
  series,
}: LineChartPanelProps<T>) {
  return (
    <div className="report-section">
      <h3 className="mb-6 flex items-center gap-2 font-bold text-[var(--text)]">
        {title}
        {subtitle ? <span className="font-normal text-slate-400">{subtitle}</span> : null}
      </h3>
      <div className="h-[300px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center text-sm text-slate-500">
            Monthly breakdown not loaded yet. Export Meta monthly results and we&apos;ll populate this chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              {series.map((line) => (
                <Line
                  key={line.dataKey}
                  dataKey={line.dataKey}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth ?? 2}
                  dot={false}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

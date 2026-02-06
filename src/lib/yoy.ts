import { formatNumber, formatPercent, formatZar } from "./format";

export type MetricKind = "number" | "currency" | "ratio";

export interface YoYDisplay {
  absoluteChange: string;
  percentChange: string;
}

function signed(value: string, positive: boolean): string {
  return `${positive ? "+" : "−"}${value}`;
}

function signedPercent(value: number, decimals: number): string {
  const positive = value >= 0;
  return signed(`${(Math.abs(value) * 100).toFixed(decimals)}%`, positive);
}

export function getYoYDisplay(current: number, previous: number | null | undefined, kind: MetricKind): YoYDisplay {
  if (previous == null || !Number.isFinite(previous) || previous <= 0) {
    return { absoluteChange: "—", percentChange: "—" };
  }

  const deltaValue = current - previous;
  const deltaPercent = deltaValue / previous;
  const positive = deltaValue >= 0;

  if (kind === "currency") {
    return {
      absoluteChange: signed(formatZar(Math.abs(deltaValue)), positive),
      percentChange: signedPercent(deltaPercent, 1),
    };
  }

  if (kind === "ratio") {
    return {
      absoluteChange: signed(formatPercent(Math.abs(deltaValue)), positive),
      percentChange: signedPercent(deltaPercent, 1),
    };
  }

  return {
    absoluteChange: signed(formatNumber(Math.abs(deltaValue)), positive),
    percentChange: signedPercent(deltaPercent, 1),
  };
}

export function formatZar(value: number): string {
  return `R${Math.round(value).toLocaleString("en-US")}`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(2)}%`;
}

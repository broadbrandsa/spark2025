import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

export interface SearchConsoleRow {
  [key: string]: string;
}

export interface SearchConsoleMetricRow {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
}

export interface SearchConsoleHeadline {
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
}

export interface SearchConsoleData {
  headline: SearchConsoleHeadline;
  topQueries: SearchConsoleMetricRow[];
  topCountries: SearchConsoleMetricRow[];
  pages: SearchConsoleRow[];
  devices: SearchConsoleRow[];
  searchAppearance: SearchConsoleRow[];
  filters: SearchConsoleRow[];
}

const SEARCH_CONSOLE_DIR_CANDIDATES = [
  path.join(process.cwd(), "data", "search-console"),
  path.join(process.cwd(), "data", "search console"),
];

function resolveSearchConsoleDir(): string {
  const found = SEARCH_CONSOLE_DIR_CANDIDATES.find((dir) => fs.existsSync(dir));

  if (!found) {
    throw new Error("Search Console data directory not found in /data/search-console or /data/search console");
  }

  return found;
}

function asNumber(raw: string): number {
  const normalized = String(raw ?? "")
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readCsvRows(filePath: string): SearchConsoleRow[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const text = fs.readFileSync(filePath, "utf8");
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  }) as SearchConsoleRow[];
}

function toMetricRows(
  rows: SearchConsoleRow[],
  labelKeys: string[],
  limit: number,
): SearchConsoleMetricRow[] {
  const mapped = rows.map((row) => {
    const label = labelKeys.map((key) => row[key]).find((value) => !!value)?.trim() ?? "Unknown";
    const clicks = asNumber(row.Clicks ?? "0");
    const impressions = asNumber(row.Impressions ?? "0");
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const avgPosition = asNumber(row.Position ?? row["Average position"] ?? "0");

    return {
      label,
      clicks,
      impressions,
      ctr,
      avgPosition,
    };
  });

  return mapped.sort((a, b) => b.clicks - a.clicks).slice(0, limit);
}

function computeHeadline(chartRows: SearchConsoleRow[]): SearchConsoleHeadline {
  const clicks = chartRows.reduce((sum, row) => sum + asNumber(row.Clicks ?? "0"), 0);
  const impressions = chartRows.reduce((sum, row) => sum + asNumber(row.Impressions ?? "0"), 0);

  const weightedPositionSum = chartRows.reduce((sum, row) => {
    const position = asNumber(row.Position ?? row["Average position"] ?? "0");
    const rowImpressions = asNumber(row.Impressions ?? "0");
    return sum + position * rowImpressions;
  }, 0);

  const avgCtr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = impressions > 0 ? weightedPositionSum / impressions : 0;

  return {
    clicks,
    impressions,
    avgCtr,
    avgPosition,
  };
}

export async function loadSearchConsoleData(): Promise<SearchConsoleData> {
  const dataDir = resolveSearchConsoleDir();

  const chartRows = readCsvRows(path.join(dataDir, "Chart.csv"));
  const queryRows = readCsvRows(path.join(dataDir, "Queries.csv"));
  const countryRows = readCsvRows(path.join(dataDir, "Countries.csv"));
  const pageRows = readCsvRows(path.join(dataDir, "Pages.csv"));
  const deviceRows = readCsvRows(path.join(dataDir, "Devices.csv"));
  const appearanceRows = readCsvRows(path.join(dataDir, "Search appearance.csv"));
  const filterRows = readCsvRows(path.join(dataDir, "Filters.csv"));

  return {
    headline: computeHeadline(chartRows),
    topQueries: toMetricRows(queryRows, ["Query", "Top queries"], 10),
    topCountries: toMetricRows(countryRows, ["Country"], 10),
    pages: pageRows,
    devices: deviceRows,
    searchAppearance: appearanceRows,
    filters: filterRows,
  };
}

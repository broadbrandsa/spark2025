import path from "node:path";
import fs from "node:fs";
import * as XLSX from "xlsx";

export interface MetaRawRow {
  campaignName: string;
  adSetName: string;
  resultType: string;
  results: number;
  costPerResult: number;
  amountSpentZar: number;
  impressions: number;
  clicksAll: number;
  cpcAll: number;
  reach: number;
  reportingStarts: string;
  reportingEnds: string;
}

export interface MetaTotals {
  metaLeads: number;
  metaPaidLeadsBb24: number;
  metaSpend: number;
  metaClicks: number;
  metaImpressions: number;
  metaReach: number;
  metaCpl: number;
  metaAvgCpc: number;
  metaAvgCtr: number;
}

export const CURRENT_META_FILE = path.join(
  process.cwd(),
  "data",
  "meta",
  "meta-report-Jan-1-2025-to-Jan-31-2026.xlsx",
);
export const COMPARISON_META_FILE = path.join(
  process.cwd(),
  "data",
  "meta",
  "Meta-report-Jan-1-2024-to-Jan-31-2025-Comparision.xlsx",
);

function asNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "").trim();
    if (!normalized) {
      return 0;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function asString(value: unknown): string {
  if (value == null) {
    return "";
  }

  return String(value).trim();
}

export async function loadMetaRawRows(filePath = CURRENT_META_FILE): Promise<MetaRawRow[]> {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const workbook = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });
  const sheetName = workbook.SheetNames.includes("Raw Data Report")
    ? "Raw Data Report"
    : workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error("No readable worksheet found in Meta XLSX export");
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: true,
  });

  return rows.map((row) => ({
    campaignName: asString(row["Campaign name"]),
    adSetName: asString(row["Ad set name"]),
    resultType: asString(row["Result type"]),
    results: asNumber(row["Results"]),
    costPerResult: asNumber(row["Cost per result"]),
    amountSpentZar: asNumber(row["Amount spent (ZAR)"]),
    impressions: asNumber(row["Impressions"]),
    clicksAll: asNumber(row["Clicks (all)"]),
    cpcAll: asNumber(row["CPC (all)"]),
    reach: asNumber(row["Reach"]),
    reportingStarts: asString(row["Reporting starts"]),
    reportingEnds: asString(row["Reporting ends"]),
  }));
}

export async function computeMetaTotals(): Promise<MetaTotals> {
  let rows = await loadMetaRawRows(CURRENT_META_FILE);
  if (rows.length === 0) {
    rows = await loadMetaRowsByPattern(/Meta-.*2025.*\\.xlsx$/i);
  }
  return computeMetaTotalsFromRows(rows);
}

export async function computeMetaComparisonTotals(): Promise<MetaTotals> {
  let rows = await loadMetaRawRows(COMPARISON_META_FILE);
  if (rows.length === 0) {
    rows = await loadMetaRowsByPattern(/Meta-.*2024.*\\.xlsx$/i);
  }
  return computeMetaTotalsFromRows(rows);
}

async function loadMetaRowsByPattern(filePattern: RegExp): Promise<MetaRawRow[]> {
  const metaDir = path.join(process.cwd(), "data", "meta");
  if (!fs.existsSync(metaDir)) {
    return [];
  }

  const files = fs
    .readdirSync(metaDir)
    .filter((file) => filePattern.test(file))
    .map((file) => path.join(metaDir, file));

  const nested = await Promise.all(files.map((filePath) => loadMetaRawRows(filePath)));
  return nested.flat();
}

function computeMetaTotalsFromRows(rows: MetaRawRow[]): MetaTotals {

  let metaLeads = 0;
  let metaPaidLeadsBb24 = 0;
  let metaSpend = 0;
  let metaClicks = 0;
  let metaImpressions = 0;
  let metaReach = 0;

  for (const row of rows) {
    const resultType = row.resultType.trim();

    if (/lead/i.test(resultType)) {
      metaLeads += row.results;
    }
    if (resultType === "Lead Submission (BB24)") {
      metaPaidLeadsBb24 += row.results;
    }

    metaSpend += row.amountSpentZar;
    metaClicks += row.clicksAll;
    metaImpressions += row.impressions;
    metaReach += row.reach;
  }

  const metaCpl = metaLeads > 0 ? metaSpend / metaLeads : 0;
  const metaAvgCpc = metaClicks > 0 ? metaSpend / metaClicks : 0;
  const metaAvgCtr = metaImpressions > 0 ? metaClicks / metaImpressions : 0;

  return {
    metaLeads,
    metaPaidLeadsBb24,
    metaSpend,
    metaClicks,
    metaImpressions,
    metaReach,
    metaCpl,
    metaAvgCpc,
    metaAvgCtr,
  };
}

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

export interface GoogleRawRow {
  period: string;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
}

export interface GoogleTotals {
  googleLeads: number;
  googleSpend: number;
  googleClicks: number;
  googleImpressions: number;
  googleCpl: number;
  googleAvgCpc: number;
  googleAvgCtr: number;
}

const GOOGLE_TOTALS_HARDCODED: GoogleTotals = {
  googleLeads: 0,
  googleSpend: 0,
  googleClicks: 0,
  googleImpressions: 0,
  googleCpl: 0,
  googleAvgCpc: 0,
  googleAvgCtr: 0,
};

export async function loadGoogleRawRows(filePath?: string): Promise<GoogleRawRow[]> {
  return [];
}

export async function computeGoogleTotals(): Promise<GoogleTotals> {
  return GOOGLE_TOTALS_HARDCODED;
}

export async function computeGoogleComparisonTotals(): Promise<GoogleTotals> {
  return GOOGLE_TOTALS_HARDCODED;
}

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

export interface MetaMonthlyMetrics {
  monthKey: string;
  metaLeads: number | null;
  metaSpend: number | null;
  metaClicks: number | null;
  metaImpressions: number | null;
  metaReach: number | null;
  metaCpl: number | null;
  metaCpc: number | null;
  metaCtr: number | null;
}

const META_DATA_HARDCODED: Record<string, MetaMonthlyMetrics> = {
  "2025-02-01": { monthKey: "2025-02-01", metaLeads: 916, metaSpend: 156000, metaClicks: 72554, metaCpl: 167, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-03-01": { monthKey: "2025-03-01", metaLeads: 1376, metaSpend: 131148, metaClicks: 59166, metaCpl: 96, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-04-01": { monthKey: "2025-04-01", metaLeads: 1164, metaSpend: 231905, metaClicks: 83341, metaCpl: 170, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-05-01": { monthKey: "2025-05-01", metaLeads: 1241, metaSpend: 244266, metaClicks: 131380, metaCpl: 158, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-06-01": { monthKey: "2025-06-01", metaLeads: 773, metaSpend: 107435, metaClicks: 62602, metaCpl: 98, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-07-01": { monthKey: "2025-07-01", metaLeads: 773, metaSpend: 204126, metaClicks: 139333, metaCpl: 121, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-08-01": { monthKey: "2025-08-01", metaLeads: 807, metaSpend: 164589, metaClicks: 78232, metaCpl: 170, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-09-01": { monthKey: "2025-09-01", metaLeads: 2243, metaSpend: 295926, metaClicks: 152816, metaCpl: 217, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-10-01": { monthKey: "2025-10-01", metaLeads: 3881, metaSpend: 267181, metaClicks: 103494, metaCpl: 74, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-11-01": { monthKey: "2025-11-01", metaLeads: 2769, metaSpend: 305923, metaClicks: 90737, metaCpl: 119, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2025-12-01": { monthKey: "2025-12-01", metaLeads: 2281, metaSpend: 288747, metaClicks: 87364, metaCpl: 121, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
  "2026-01-01": { monthKey: "2026-01-01", metaLeads: 2105, metaSpend: 196731, metaClicks: 87981, metaCpl: 90, metaImpressions: 0, metaReach: 0, metaCpc: 0, metaCtr: 0 },
};


export async function loadMetaMonthlyMap(): Promise<Record<string, MetaMonthlyMetrics>> {
  return META_DATA_HARDCODED;
}

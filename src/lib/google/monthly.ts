import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

export interface GoogleMonthlyMetrics {
  monthKey: string;
  googleLeads: number | null;
  googleSpend: number | null;
  googleClicks: number | null;
  googleImpressions: number | null;
  googleCpl: number | null;
  googleCpc: number | null;
  googleCtr: number | null;
}

const GOOGLE_DATA_HARDCODED: Record<string, GoogleMonthlyMetrics> = {
  "2025-02-01": { monthKey: "2025-02-01", googleLeads: 317, googleSpend: 13204, googleClicks: 10333, googleCpl: 42, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-03-01": { monthKey: "2025-03-01", googleLeads: 453, googleSpend: 16055, googleClicks: 9409, googleCpl: 35, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-04-01": { monthKey: "2025-04-01", googleLeads: 335, googleSpend: 15162, googleClicks: 7712, googleCpl: 45, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-05-01": { monthKey: "2025-05-01", googleLeads: 420, googleSpend: 18597, googleClicks: 9355, googleCpl: 44, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-06-01": { monthKey: "2025-06-01", googleLeads: 393, googleSpend: 18593, googleClicks: 7848, googleCpl: 47, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-07-01": { monthKey: "2025-07-01", googleLeads: 720, googleSpend: 49292, googleClicks: 15228, googleCpl: 68, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-08-01": { monthKey: "2025-08-01", googleLeads: 939, googleSpend: 63097, googleClicks: 17856, googleCpl: 67, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-09-01": { monthKey: "2025-09-01", googleLeads: 1373, googleSpend: 45961, googleClicks: 14699, googleCpl: 33, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-10-01": { monthKey: "2025-10-01", googleLeads: 1639, googleSpend: 62213, googleClicks: 17759, googleCpl: 38, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-11-01": { monthKey: "2025-11-01", googleLeads: 1669, googleSpend: 72575, googleClicks: 17521, googleCpl: 44, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2025-12-01": { monthKey: "2025-12-01", googleLeads: 717, googleSpend: 58866, googleClicks: 15829, googleCpl: 82, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
  "2026-01-01": { monthKey: "2026-01-01", googleLeads: 2082, googleSpend: 96718, googleClicks: 43011, googleCpl: 46, googleImpressions: 0, googleCpc: 0, googleCtr: 0 },
};

export async function loadGoogleMonthlyMap(): Promise<Record<string, GoogleMonthlyMetrics>> {
  return GOOGLE_DATA_HARDCODED;
}

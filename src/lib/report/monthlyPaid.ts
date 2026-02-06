import { loadGoogleMonthlyMap, type GoogleMonthlyMetrics } from "../google/monthly";
import { loadMetaMonthlyMap, type MetaMonthlyMetrics } from "../meta/monthly";

export interface UnifiedMonthlyPaid {
  monthKey: string;
  monthLabel: string;
  meta: MetaMonthlyMetrics | null;
  google: GoogleMonthlyMetrics | null;
  paid: {
    paidLeads: number | null;
    paidSpend: number | null;
    paidCpl: number | null;
    paidClicks: number | null;
    yoyLeads?: string;
    yoySpend?: string;
    yoyClicks?: string;
    yoyCpl?: string;
  };
}

const COMBINED_DATA_HARDCODED: Record<string, { leads: number; spend: number; clicks: number; yoyLeads: string; yoySpend: string; yoyClicks: string; yoyCpl: string }> = {
  "2025-02-01": { leads: 1233, spend: 169204, clicks: 82887, yoyLeads: "+73%", yoySpend: "+28%", yoyClicks: "+94%", yoyCpl: "-26%" },
  "2025-03-01": { leads: 1829, spend: 147203, clicks: 68575, yoyLeads: "+259%", yoySpend: "+53%", yoyClicks: "+62%", yoyCpl: "-58%" },
  "2025-04-01": { leads: 1499, spend: 247067, clicks: 91053, yoyLeads: "+35%", yoySpend: "+79%", yoyClicks: "+10%", yoyCpl: "+33%" },
  "2025-05-01": { leads: 1661, spend: 262863, clicks: 140735, yoyLeads: "-39%", yoySpend: "+3%", yoyClicks: "-3%", yoyCpl: "+68%" },
  "2025-06-01": { leads: 1166, spend: 126028, clicks: 70450, yoyLeads: "-55%", yoySpend: "-40%", yoyClicks: "-33%", yoyCpl: "+33%" },
  "2025-07-01": { leads: 1493, spend: 253418, clicks: 154561, yoyLeads: "-39%", yoySpend: "+28%", yoyClicks: "+35%", yoyCpl: "+110%" },
  "2025-08-01": { leads: 1746, spend: 227686, clicks: 96088, yoyLeads: "-17%", yoySpend: "-1%", yoyClicks: "-21%", yoyCpl: "+19%" },
  "2025-09-01": { leads: 3616, spend: 341887, clicks: 167515, yoyLeads: "-36%", yoySpend: "+35%", yoyClicks: "+41%", yoyCpl: "+111%" },
  "2025-10-01": { leads: 5520, spend: 329394, clicks: 121253, yoyLeads: "-3%", yoySpend: "-19%", yoyClicks: "-38%", yoyCpl: "-15%" },
  "2025-11-01": { leads: 4438, spend: 378498, clicks: 108258, yoyLeads: "+2%", yoySpend: "-20%", yoyClicks: "-51%", yoyCpl: "-22%" },
  "2025-12-01": { leads: 2998, spend: 347613, clicks: 103193, yoyLeads: "-29%", yoySpend: "-3%", yoyClicks: "-39%", yoyCpl: "+36%" },
  "2026-01-01": { leads: 4187, spend: 293449, clicks: 130992, yoyLeads: "-5%", yoySpend: "-39%", yoyClicks: "-41%", yoyCpl: "-36%" },
};

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map((v) => Number(v));
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function buildMonthRange(): string[] {
  const result: string[] = [];
  let year = 2025;
  let month = 1;

  while (year < 2026 || (year === 2026 && month <= 1)) {
    result.push(`${year}-${String(month).padStart(2, "0")}-01`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return result;
}

export async function loadUnifiedMonthlyPaidStory(): Promise<UnifiedMonthlyPaid[]> {
  const [metaMap, googleMap] = await Promise.all([loadMetaMonthlyMap(), loadGoogleMonthlyMap()]);
  const monthRange = buildMonthRange();

  return monthRange.map((monthKey) => {
    const combined = COMBINED_DATA_HARDCODED[monthKey];
    // If we have hardcoded data, use it. Otherwise fall back to (meta or null)
    const paidLeads = combined?.leads ?? null;
    const paidSpend = combined?.spend ?? null;
    const paidClicks = combined?.clicks ?? null;
    const paidCpl = paidLeads && paidLeads > 0 && paidSpend != null ? paidSpend / paidLeads : null;

    return {
      monthKey,
      monthLabel: monthLabel(monthKey),
      meta: metaMap[monthKey] ?? null,
      google: googleMap[monthKey] ?? null,
      paid: {
        paidLeads,
        paidSpend,
        paidCpl,
        paidClicks,
        yoyLeads: combined?.yoyLeads,
        yoySpend: combined?.yoySpend,
        yoyClicks: combined?.yoyClicks,
        yoyCpl: combined?.yoyCpl,
      },
    };
  });
}

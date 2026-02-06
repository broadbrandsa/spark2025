export type YoYChannel = "Meta" | "Google";
export type YoYMetric = "Leads" | "Spend" | "CPL" | "Clicks";

export interface YoYRow {
  channel: YoYChannel;
  month: string;
  metric: YoYMetric;
  current: number;
  previous: number;
  delta: number;
  percentDelta: number | null;
  displayLabel?: string; // New field for hardcoded text
}

// Google Hardcoded Strings (User Provided)
const GOOGLE_YOY_STRINGS: Record<string, { Leads: string; Spend: string; CPL: string; Clicks: string }> = {
  "2025-02-01": { Leads: "-21%", Spend: "-83%", CPL: "-79%", Clicks: "+78%" },
  "2025-03-01": { Leads: "+22%", Spend: "-68%", CPL: "-74%", Clicks: "+96%" },
  "2025-04-01": { Leads: "-34%", Spend: "-71%", CPL: "-56%", Clicks: "+27%" },
  "2025-05-01": { Leads: "-56%", Spend: "-78%", CPL: "-49%", Clicks: "-14%" },
  "2025-06-01": { Leads: "-51%", Spend: "-75%", CPL: "-50%", Clicks: "-17%" },
  "2025-07-01": { Leads: "+29%", Spend: "-39%", CPL: "-53%", Clicks: "+42%" },
  "2025-08-01": { Leads: "+19%", Spend: "-18%", CPL: "-31%", Clicks: "+108%" },
  "2025-09-01": { Leads: "-27%", Spend: "-35%", CPL: "-11%", Clicks: "+25%" },
  "2025-10-01": { Leads: "-48%", Spend: "-59%", CPL: "-21%", Clicks: "-41%" },
  "2025-11-01": { Leads: "-12%", Spend: "-63%", CPL: "-57%", Clicks: "-60%" },
  "2025-12-01": { Leads: "-48%", Spend: "-20%", CPL: "+52%", Clicks: "-38%" },
  "2026-01-01": { Leads: "+49%", Spend: "-25%", CPL: "-50%", Clicks: "+261%" },
};

// Meta Hardcoded Strings (User Provided)
// Note: User requested "Clicks" to be treated as text.
const META_YOY_STRINGS: Record<string, { Leads: string; Spend: string; CPL: string; Clicks: string }> = {
  "2025-02-01": { Leads: "+194%", Spend: "+195%", CPL: "+2%", Clicks: "+96%" },
  "2025-03-01": { Leads: "+897%", Spend: "+184%", CPL: "-71%", Clicks: "+57%" },
  "2025-04-01": { Leads: "+91%", Spend: "+169%", CPL: "-48%", Clicks: "+9%" },
  "2025-05-01": { Leads: "-29%", Spend: "+44%", CPL: "+50%", Clicks: "-2%" },
  "2025-06-01": { Leads: "-57%", Spend: "-19%", CPL: "-16%", Clicks: "-35%" },
  "2025-07-01": { Leads: "-59%", Spend: "+75%", CPL: "+8%", Clicks: "+34%" },
  "2025-08-01": { Leads: "-38%", Spend: "+8%", CPL: "+73%", Clicks: "-30%" },
  "2025-09-01": { Leads: "-40%", Spend: "+62%", CPL: "+175%", Clicks: "+43%" },
  "2025-10-01": { Leads: "+52%", Spend: "+5%", CPL: "+9%", Clicks: "-37%" },
  "2025-11-01": { Leads: "+13%", Spend: "+9%", CPL: "+35%", Clicks: "-49%" },
  "2025-12-01": { Leads: "-20%", Spend: "+1%", CPL: "+13%", Clicks: "-39%" },
  "2026-01-01": { Leads: "-30%", Spend: "-45%", CPL: "-7%", Clicks: "-58%" },
};

function createRow(channel: YoYChannel, month: string, metric: YoYMetric, label: string): YoYRow {
  // We only care about displayLabel for now as per user request
  return {
    channel,
    month,
    metric,
    current: 0,
    previous: 0,
    delta: 0,
    percentDelta: 0,
    displayLabel: label
  };
}

export async function loadYoY(): Promise<Record<string, YoYRow>> {
  const map: Record<string, YoYRow> = {};

  // Use Hardcoded Google Strings
  for (const [monthKey, data] of Object.entries(GOOGLE_YOY_STRINGS)) {
    map[`Google|${monthKey}|Leads`] = createRow("Google", monthKey, "Leads", data.Leads);
    map[`Google|${monthKey}|Spend`] = createRow("Google", monthKey, "Spend", data.Spend);
    map[`Google|${monthKey}|CPL`] = createRow("Google", monthKey, "CPL", data.CPL);
    map[`Google|${monthKey}|Clicks`] = createRow("Google", monthKey, "Clicks", data.Clicks);
  }

  // Use Hardcoded Meta Strings
  for (const [monthKey, data] of Object.entries(META_YOY_STRINGS)) {
    map[`Meta|${monthKey}|Leads`] = createRow("Meta", monthKey, "Leads", data.Leads);
    map[`Meta|${monthKey}|Spend`] = createRow("Meta", monthKey, "Spend", data.Spend);
    map[`Meta|${monthKey}|CPL`] = createRow("Meta", monthKey, "CPL", data.CPL);
    map[`Meta|${monthKey}|Clicks`] = createRow("Meta", monthKey, "Clicks", data.Clicks);
  }

  return map;
}

import { formatNumber } from "../format";
import { getYoYDisplay, type YoYDisplay } from "../yoy";
import { buildSchoolCatalog, classifyMetaRow, setKnownSchools, type SchoolPhase } from "./attribution";
import { COMPARISON_META_FILE, CURRENT_META_FILE, type MetaRawRow, loadMetaRawRows } from "./loadMeta";

export interface SchoolMetrics {
  leadsTotal: number;
  leadsBb24: number;
  spend: number;
  clicks: number;
  impressions: number;
  reach: number;
  cpl: number;
  cpc: number;
  ctr: number;
}

export interface YoYSchoolMetrics {
  leadsTotal: YoYDisplay;
  spend: YoYDisplay;
  cpl: YoYDisplay;
  clicks: YoYDisplay;
  ctr: YoYDisplay;
  cpc: YoYDisplay;
}

export interface SchoolBreakdownRow {
  name: string;
  leads: number;
  spend: number;
  cpl: number;
}

export interface SchoolPhaseData {
  phase: SchoolPhase;
  current: SchoolMetrics;
  previous: SchoolMetrics;
  yoy: YoYSchoolMetrics;
  topCampaigns: SchoolBreakdownRow[];
  topAdSets: SchoolBreakdownRow[];
}

export interface SchoolAggregate {
  slug: string;
  school: string;
  displayName: string;
  phaseLabel: "Primary" | "High" | "All" | "Mixed";
  availablePhases: SchoolPhase[];
  phaseData: Record<string, SchoolPhaseData>;
  listMetrics: SchoolMetrics;
}

export interface MetaSchoolsData {
  schools: SchoolAggregate[];
}

interface AttributedRow extends MetaRawRow {
  school: string;
  phase: SchoolPhase;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function zeroMetrics(): SchoolMetrics {
  return {
    leadsTotal: 0,
    leadsBb24: 0,
    spend: 0,
    clicks: 0,
    impressions: 0,
    reach: 0,
    cpl: 0,
    cpc: 0,
    ctr: 0,
  };
}

function computeMetrics(rows: AttributedRow[]): SchoolMetrics {
  const metrics = zeroMetrics();

  for (const row of rows) {
    const resultType = row.resultType.trim();
    if (/lead/i.test(resultType)) {
      metrics.leadsTotal += row.results;
    }
    if (resultType === "Lead Submission (BB24)") {
      metrics.leadsBb24 += row.results;
    }

    metrics.spend += row.amountSpentZar;
    metrics.clicks += row.clicksAll;
    metrics.impressions += row.impressions;
    metrics.reach += row.reach;
  }

  metrics.cpl = metrics.leadsTotal > 0 ? metrics.spend / metrics.leadsTotal : 0;
  metrics.cpc = metrics.clicks > 0 ? metrics.spend / metrics.clicks : 0;
  metrics.ctr = metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0;

  return metrics;
}

function buildBreakdown(rows: AttributedRow[], field: "campaignName" | "adSetName"): SchoolBreakdownRow[] {
  const map = new Map<string, { leads: number; spend: number }>();

  for (const row of rows) {
    const key = row[field].trim() || "Unknown";
    const bucket = map.get(key) ?? { leads: 0, spend: 0 };

    if (/lead/i.test(row.resultType.trim())) {
      bucket.leads += row.results;
    }
    bucket.spend += row.amountSpentZar;

    map.set(key, bucket);
  }

  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      leads: value.leads,
      spend: value.spend,
      cpl: value.leads > 0 ? value.spend / value.leads : 0,
    }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 10);
}

function schoolKey(school: string, phase: SchoolPhase): string {
  if (school === "General") {
    return `${school}|${phase}`;
  }

  return school;
}

function schoolSlug(school: string, phase: SchoolPhase): string {
  if (school === "General") {
    return slugify(`${school} ${phase}`);
  }

  return slugify(school);
}

function phaseLabel(phases: SchoolPhase[], school: string): "Primary" | "High" | "All" | "Mixed" {
  if (school === "General" && phases.length === 1) {
    return phases[0] as "Primary" | "High" | "All";
  }

  if (phases.length > 1) {
    return "Mixed";
  }

  return phases[0] as "Primary" | "High" | "All";
}

function withAttribution(rows: MetaRawRow[]): AttributedRow[] {
  return rows.map((row) => {
    const attributed = classifyMetaRow(row.adSetName);
    return {
      ...row,
      school: attributed.school,
      phase: attributed.phase,
    };
  });
}

export async function loadMetaSchoolsData(): Promise<MetaSchoolsData> {
  const [currentRows, previousRows] = await Promise.all([
    loadMetaRawRows(CURRENT_META_FILE),
    loadMetaRawRows(COMPARISON_META_FILE),
  ]);

  const catalog = buildSchoolCatalog([...currentRows, ...previousRows].map((row) => row.adSetName));
  setKnownSchools(catalog);

  const attributedCurrent = withAttribution(currentRows);
  const attributedPrevious = withAttribution(previousRows);

  const grouped = new Map<string, { school: string; slug: string; current: AttributedRow[]; previous: AttributedRow[] }>();

  const ensureGroup = (school: string, phase: SchoolPhase) => {
    const key = schoolKey(school, phase);
    if (!grouped.has(key)) {
      grouped.set(key, {
        school,
        slug: schoolSlug(school, phase),
        current: [],
        previous: [],
      });
    }

    return grouped.get(key)!;
  };

  for (const row of attributedCurrent) {
    const keyPhase = row.school === "General" ? row.phase : row.phase;
    ensureGroup(row.school, keyPhase).current.push(row);
  }

  for (const row of attributedPrevious) {
    const keyPhase = row.school === "General" ? row.phase : row.phase;
    ensureGroup(row.school, keyPhase).previous.push(row);
  }

  const nonGeneralSchoolRows = new Map<string, { current: AttributedRow[]; previous: AttributedRow[] }>();
  for (const row of attributedCurrent) {
    if (row.school === "General") continue;
    const bucket = nonGeneralSchoolRows.get(row.school) ?? { current: [], previous: [] };
    bucket.current.push(row);
    nonGeneralSchoolRows.set(row.school, bucket);
  }
  for (const row of attributedPrevious) {
    if (row.school === "General") continue;
    const bucket = nonGeneralSchoolRows.get(row.school) ?? { current: [], previous: [] };
    bucket.previous.push(row);
    nonGeneralSchoolRows.set(row.school, bucket);
  }

  const schools: SchoolAggregate[] = [];

  for (const [school, rows] of nonGeneralSchoolRows.entries()) {
    const phases = [...new Set(rows.current.concat(rows.previous).map((row) => row.phase))] as SchoolPhase[];
    const availablePhases = [...new Set(["All" as SchoolPhase, ...phases])] as SchoolPhase[];

    const phaseData: Record<string, SchoolPhaseData> = {};

    for (const phase of availablePhases) {
      const currentPhaseRows = phase === "All" ? rows.current : rows.current.filter((row) => row.phase === phase);
      const previousPhaseRows = phase === "All" ? rows.previous : rows.previous.filter((row) => row.phase === phase);

      const current = computeMetrics(currentPhaseRows);
      const previous = computeMetrics(previousPhaseRows);

      phaseData[phase] = {
        phase,
        current,
        previous,
        yoy: {
          leadsTotal: getYoYDisplay(current.leadsTotal, previous.leadsTotal, "number"),
          spend: getYoYDisplay(current.spend, previous.spend, "currency"),
          cpl: getYoYDisplay(current.cpl, previous.cpl, "currency"),
          clicks: getYoYDisplay(current.clicks, previous.clicks, "number"),
          ctr: getYoYDisplay(current.ctr, previous.ctr, "ratio"),
          cpc: getYoYDisplay(current.cpc, previous.cpc, "currency"),
        },
        topCampaigns: buildBreakdown(currentPhaseRows, "campaignName"),
        topAdSets: buildBreakdown(currentPhaseRows, "adSetName"),
      };
    }

    schools.push({
      slug: schoolSlug(school, "All"),
      school,
      displayName: school,
      phaseLabel: phaseLabel(phases, school),
      availablePhases,
      phaseData,
      listMetrics: phaseData.All.current,
    });
  }

  for (const [key, group] of grouped.entries()) {
    if (!key.startsWith("General|")) continue;

    const phase = key.split("|")[1] as SchoolPhase;
    const current = computeMetrics(group.current);
    const previous = computeMetrics(group.previous);

    schools.push({
      slug: schoolSlug("General", phase),
      school: "General",
      displayName: `General (${phase})`,
      phaseLabel: phase as "Primary" | "High" | "All",
      availablePhases: [phase],
      phaseData: {
        [phase]: {
          phase,
          current,
          previous,
          yoy: {
            leadsTotal: getYoYDisplay(current.leadsTotal, previous.leadsTotal, "number"),
            spend: getYoYDisplay(current.spend, previous.spend, "currency"),
            cpl: getYoYDisplay(current.cpl, previous.cpl, "currency"),
            clicks: getYoYDisplay(current.clicks, previous.clicks, "number"),
            ctr: getYoYDisplay(current.ctr, previous.ctr, "ratio"),
            cpc: getYoYDisplay(current.cpc, previous.cpc, "currency"),
          },
          topCampaigns: buildBreakdown(group.current, "campaignName"),
          topAdSets: buildBreakdown(group.current, "adSetName"),
        },
      },
      listMetrics: current,
    });
  }

  schools.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return { schools };
}

export async function loadMetaSchoolDirectory(): Promise<Array<{ slug: string; label: string }>> {
  const data = await loadMetaSchoolsData();
  return data.schools.map((school) => ({
    slug: school.slug,
    label: school.displayName,
  }));
}

export async function loadMetaSchoolBySlug(schoolSlug: string): Promise<SchoolAggregate | null> {
  const data = await loadMetaSchoolsData();
  return data.schools.find((school) => school.slug === schoolSlug) ?? null;
}

export function metricSummary(metrics: SchoolMetrics): string {
  return `${formatNumber(metrics.leadsTotal)} leads`;
}

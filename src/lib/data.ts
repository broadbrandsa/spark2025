/**
 * Data loading utilities for the SPARK Schools Marketing Performance Review.
 *
 * CSV ingestion is intentionally stubbed for now. This file returns deterministic
 * mock data so pages can be scaffolded and styled against a stable structure.
 */

export type SchoolPhase = "Primary" | "High";

export interface KpiMetric {
  id: string;
  label: string;
  current: string;
  previous: string;
  deltaAbsolute: string;
  deltaPercent: number;
}

export interface LeadsTrendPoint {
  month: string;
  totalLeads: number;
  paidLeads: number;
  organicLeads: number;
}

export interface CplTrendPoint {
  month: string;
  metaCpl: number;
  googleCpl: number;
  blendedCpl: number;
}

export interface ChannelSplit {
  spend: string;
  leads: string;
  cpl: string;
}

export interface PaidMediaOverview {
  totalPaidSpend: string;
  paidLeads: string;
  blendedPaidCpl: string;
  paidClicks: string;
  avgCpc: string;
  avgCtr: string;
  channelSplit: {
    meta: ChannelSplit;
    google: ChannelSplit;
  };
}

export interface TopRegionRow {
  region: string;
  leads: string;
  conversionRate: string;
}

export interface SearchConsoleOverview {
  totalClicks: string;
  totalImpressions: string;
  averagePosition: string;
  topQueries: Array<{
    query: string;
    clicks: string;
    impressions: string;
    position: string;
  }>;
}

export interface OrganicOverview {
  organicWebsiteLeads: string;
  sessions: string;
  conversionRate: string;
  topRegions: TopRegionRow[];
  searchConsole: SearchConsoleOverview;
}

export interface NarrativeContent {
  executiveSummary: string;
  whatWeDid: string[];
  challenges: string[];
  nextFocusAreas: string[];
}

export interface SchoolSummary {
  slug: string;
  name: string;
  phase: SchoolPhase;
  summary: {
    totalLeads: string;
    paidLeads: string;
    organicLeads: string;
  };
}

export interface DetailMetricRow {
  label: string;
  value: string;
}

export interface SchoolChannelDetails {
  meta: {
    spend: string;
    leads: string;
    cpl: string;
    clicks: string;
    ctr: string;
    cpc: string;
    topCampaigns: Array<{ campaign: string; leads: string; cpl: string }>;
    topAdSets: Array<{ adSet: string; leads: string; cpl: string }>;
  };
  google: {
    spend: string;
    leads: string;
    cpl: string;
    clicks: string;
    ctr: string;
    cpc: string;
    topCampaigns: Array<{ campaign: string; leads: string; cpl: string }>;
  };
  organic: {
    leads: string;
    sessions: string;
    conversionRate: string;
    geoTable: Array<{ region: string; leads: string; conversionRate: string }>;
  };
}

export interface SchoolNarrative {
  wins: string[];
  challenges: string[];
  notes: string[];
}

export interface SchoolReport {
  slug: string;
  name: string;
  phase: SchoolPhase;
  dateRange: string;
  kpis: KpiMetric[];
  leadsTrend: LeadsTrendPoint[];
  cplTrend: CplTrendPoint[];
  channelDetails: SchoolChannelDetails;
  narrative: SchoolNarrative;
}

export interface ReportData {
  reportingPeriod: {
    titleRange: string;
    subtitleRange: string;
  };
  overviewIntro: string;
  overviewKpis: KpiMetric[];
  leadsTrend: LeadsTrendPoint[];
  cplTrend: CplTrendPoint[];
  paidMediaOverview: PaidMediaOverview;
  organicOverview: OrganicOverview;
  overviewNarrative: NarrativeContent;
  schools: SchoolSummary[];
  schoolReports: Record<string, SchoolReport>;
}

const MONTHS = [
  "Jan 2025",
  "Feb 2025",
  "Mar 2025",
  "Apr 2025",
  "May 2025",
  "Jun 2025",
  "Jul 2025",
  "Aug 2025",
  "Sep 2025",
  "Oct 2025",
  "Nov 2025",
  "Dec 2025",
  "Jan 2026",
];

const LEADS_TOTAL = [1200, 1235, 1260, 1315, 1340, 1365, 1410, 1450, 1495, 1530, 1510, 1485, 1550];
const LEADS_PAID = [860, 890, 900, 940, 955, 980, 1010, 1040, 1065, 1090, 1080, 1060, 1110];
const LEADS_ORGANIC = [340, 345, 360, 375, 385, 385, 400, 410, 430, 440, 430, 425, 440];

const CPL_META = [182, 179, 177, 176, 174, 172, 171, 170, 168, 167, 169, 171, 166];
const CPL_GOOGLE = [236, 232, 230, 227, 225, 223, 221, 219, 217, 214, 216, 218, 212];
const CPL_BLENDED = [204, 201, 199, 196, 194, 192, 191, 189, 187, 185, 186, 188, 183];

const BASE_SCHOOL_REPORTS: Array<{
  slug: string;
  name: string;
  phase: SchoolPhase;
  leadScale: number;
}> = [
  { slug: "meyersdal", name: "SPARK Meyersdal", phase: "Primary", leadScale: 1.06 },
  { slug: "ferndale", name: "SPARK Ferndale", phase: "Primary", leadScale: 0.95 },
  { slug: "fourways", name: "SPARK Fourways", phase: "High", leadScale: 0.9 },
  { slug: "randpark-ridge", name: "SPARK Randpark Ridge", phase: "Primary", leadScale: 0.86 },
  { slug: "somerset-west", name: "SPARK Somerset West", phase: "Primary", leadScale: 0.82 },
  { slug: "centurion", name: "SPARK Centurion", phase: "High", leadScale: 0.78 },
];

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatCurrency(value: number): string {
  return `R${value.toLocaleString("en-US")}`;
}

function toLeadsTrend(): LeadsTrendPoint[] {
  return MONTHS.map((month, index) => ({
    month,
    totalLeads: LEADS_TOTAL[index],
    paidLeads: LEADS_PAID[index],
    organicLeads: LEADS_ORGANIC[index],
  }));
}

function toCplTrend(): CplTrendPoint[] {
  return MONTHS.map((month, index) => ({
    month,
    metaCpl: CPL_META[index],
    googleCpl: CPL_GOOGLE[index],
    blendedCpl: CPL_BLENDED[index],
  }));
}

function buildSchoolReport(seed: {
  slug: string;
  name: string;
  phase: SchoolPhase;
  leadScale: number;
}): SchoolReport {
  const leadsTrend = toLeadsTrend().map((row) => ({
    ...row,
    totalLeads: Math.round(row.totalLeads * seed.leadScale * 0.12),
    paidLeads: Math.round(row.paidLeads * seed.leadScale * 0.12),
    organicLeads: Math.round(row.organicLeads * seed.leadScale * 0.12),
  }));

  const totalLeads = leadsTrend.reduce((sum, row) => sum + row.totalLeads, 0);
  const paidLeads = leadsTrend.reduce((sum, row) => sum + row.paidLeads, 0);
  const organicLeads = leadsTrend.reduce((sum, row) => sum + row.organicLeads, 0);
  const paidSpend = Math.round(paidLeads * (190 + seed.leadScale * 10));
  const paidClicks = Math.round(paidLeads * 9.4);
  const blendedCpl = Math.round(paidSpend / Math.max(paidLeads, 1));

  return {
    slug: seed.slug,
    name: seed.name,
    phase: seed.phase,
    dateRange: "Jan 2025 – Jan 2026",
    kpis: [
      {
        id: "school-total-leads",
        label: "Total Leads (School)",
        current: formatNumber(totalLeads),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
      {
        id: "school-paid-leads",
        label: "Paid Leads",
        current: formatNumber(paidLeads),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
      {
        id: "school-organic-leads",
        label: "Organic Leads",
        current: formatNumber(organicLeads),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
      {
        id: "school-paid-spend",
        label: "Paid Spend",
        current: formatCurrency(paidSpend),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
      {
        id: "school-blended-cpl",
        label: "Blended Paid CPL",
        current: formatCurrency(blendedCpl),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
      {
        id: "school-paid-clicks",
        label: "Paid Clicks",
        current: formatNumber(paidClicks),
        previous: "Prev period placeholder",
        deltaAbsolute: "Delta placeholder",
        deltaPercent: 0,
      },
    ],
    leadsTrend,
    cplTrend: toCplTrend(),
    channelDetails: {
      meta: {
        spend: "R placeholder",
        leads: "Placeholder",
        cpl: "R placeholder",
        clicks: "Placeholder",
        ctr: "Placeholder %",
        cpc: "R placeholder",
        topCampaigns: [
          { campaign: "Top Campaign A (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { campaign: "Top Campaign B (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { campaign: "Top Campaign C (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
        ],
        topAdSets: [
          { adSet: "Top Ad Set A (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { adSet: "Top Ad Set B (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { adSet: "Top Ad Set C (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
        ],
      },
      google: {
        spend: "R placeholder",
        leads: "Placeholder",
        cpl: "R placeholder",
        clicks: "Placeholder",
        ctr: "Placeholder %",
        cpc: "R placeholder",
        topCampaigns: [
          { campaign: "Top Campaign A (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { campaign: "Top Campaign B (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
          { campaign: "Top Campaign C (Placeholder)", leads: "Placeholder", cpl: "R placeholder" },
        ],
      },
      organic: {
        leads: "Placeholder",
        sessions: "Placeholder",
        conversionRate: "Placeholder %",
        geoTable: [
          { region: "Region 1", leads: "Placeholder", conversionRate: "Placeholder %" },
          { region: "Region 2", leads: "Placeholder", conversionRate: "Placeholder %" },
          { region: "Region 3", leads: "Placeholder", conversionRate: "Placeholder %" },
        ],
      },
    },
    narrative: {
      wins: [
        "Placeholder school-level win describing channel performance.",
        "Placeholder school-level win describing campaign quality.",
      ],
      challenges: [
        "Placeholder school-level challenge affecting lead volume.",
        "Placeholder school-level challenge related to traffic quality.",
      ],
      notes: [
        "Placeholder operational note for this school.",
        "Placeholder note on testing and next iteration.",
      ],
    },
  };
}

const SCHOOL_REPORTS = Object.fromEntries(
  BASE_SCHOOL_REPORTS.map((school) => [school.slug, buildSchoolReport(school)]),
) as Record<string, SchoolReport>;

const REPORT_DATA: ReportData = {
  reportingPeriod: {
    titleRange: "Jan 2025 – Dec 2025 + Jan 2026",
    subtitleRange: "Jan 2025 – Jan 2026",
  },
  overviewIntro:
    "This report summarises SPARK Schools marketing performance for the period, focusing on lead outcomes across paid and organic channels. The current build uses mock values and placeholders to establish report structure before production data ingestion.",
  overviewKpis: [
    {
      id: "total-leads-all-channels",
      label: "Total Leads (All Channels)",
      current: "18,145",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
    {
      id: "paid-leads",
      label: "Paid Leads (Meta + Google)",
      current: "13,980",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
    {
      id: "organic-website-leads",
      label: "Organic Website Leads",
      current: "4,165",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
    {
      id: "total-paid-spend",
      label: "Total Paid Spend",
      current: "R2,681,400",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
    {
      id: "blended-paid-cpl",
      label: "Blended Paid CPL",
      current: "R192",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
    {
      id: "total-paid-clicks",
      label: "Total Paid Clicks",
      current: "132,540",
      previous: "Previous period placeholder",
      deltaAbsolute: "Absolute delta placeholder",
      deltaPercent: 0,
    },
  ],
  leadsTrend: toLeadsTrend(),
  cplTrend: toCplTrend(),
  paidMediaOverview: {
    totalPaidSpend: "R2,681,400",
    paidLeads: "13,980",
    blendedPaidCpl: "R192",
    paidClicks: "132,540",
    avgCpc: "R20.23",
    avgCtr: "2.81%",
    channelSplit: {
      meta: {
        spend: "R1,792,800",
        leads: "10,420",
        cpl: "R172",
      },
      google: {
        spend: "R888,600",
        leads: "3,560",
        cpl: "R250",
      },
    },
  },
  organicOverview: {
    organicWebsiteLeads: "4,165",
    sessions: "328,000",
    conversionRate: "1.27%",
    topRegions: [
      { region: "Gauteng", leads: "2,490", conversionRate: "1.41%" },
      { region: "Western Cape", leads: "1,030", conversionRate: "1.19%" },
      { region: "KwaZulu-Natal", leads: "645", conversionRate: "0.98%" },
    ],
    searchConsole: {
      totalClicks: "164,300",
      totalImpressions: "6,450,000",
      averagePosition: "11.2",
      topQueries: [
        { query: "spark schools admissions", clicks: "14,200", impressions: "312,000", position: "2.3" },
        { query: "schools near me", clicks: "9,450", impressions: "588,000", position: "8.9" },
        { query: "primary school applications", clicks: "7,980", impressions: "401,500", position: "6.4" },
        { query: "high school applications", clicks: "7,210", impressions: "360,200", position: "7.2" },
      ],
    },
  },
  overviewNarrative: {
    executiveSummary:
      "Lead acquisition remained steady across the reporting period, with paid channels carrying the majority of volume while organic continued to support conversion-efficient demand. This scaffold captures structure only and will be replaced with validated annual commentary once source data pipelines are connected.",
    whatWeDid: [
      "Placeholder: Expanded paid campaign coverage during key enrollment windows.",
      "Placeholder: Refined creative and audience testing cycles.",
      "Placeholder: Improved landing-page alignment with campaign intent.",
    ],
    challenges: [
      "Placeholder: Volatility in paid media auction pressure through peak months.",
      "Placeholder: Incomplete cross-channel attribution consistency.",
      "Placeholder: Varying data completeness by source system.",
    ],
    nextFocusAreas: [
      "Placeholder: Implement full channel-level YoY by month where prior periods exist.",
      "Placeholder: Operationalize shared KPI definitions across paid and organic.",
      "Placeholder: Finalize school-level diagnostic views with narrative integration.",
    ],
  },
  schools: BASE_SCHOOL_REPORTS.map((school) => {
    const report = SCHOOL_REPORTS[school.slug];
    const totals = report.kpis.reduce<Record<string, string>>((acc, metric) => {
      acc[metric.id] = metric.current;
      return acc;
    }, {});

    return {
      slug: school.slug,
      name: school.name,
      phase: school.phase,
      summary: {
        totalLeads: totals["school-total-leads"],
        paidLeads: totals["school-paid-leads"],
        organicLeads: totals["school-organic-leads"],
      },
    };
  }),
  schoolReports: SCHOOL_REPORTS,
};

export async function loadReportData(): Promise<ReportData> {
  return REPORT_DATA;
}

export async function loadSchoolData(schoolSlug: string): Promise<SchoolReport | null> {
  return REPORT_DATA.schoolReports[schoolSlug] ?? null;
}

export async function getAllSchoolIds(): Promise<string[]> {
  return REPORT_DATA.schools.map((school) => school.slug);
}

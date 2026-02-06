"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatZar } from "@/lib/format";
import type { UnifiedMonthlyPaid } from "@/lib/report/monthlyPaid";
import type { YoYRow } from "@/lib/report/yoy";

interface MonthStoryScrollerProps {
  months: UnifiedMonthlyPaid[];
  yoyMap: Record<string, YoYRow>;
}

function fmtMaybeCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return formatZar(value);
}

function fmtMaybeNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return formatNumber(value);
}

const renderLeftLabel = (props: any, formatter: (val: number) => string, metricName: string, yoyText?: string) => {
  const { x, y, width, height, value } = props;
  if (!value) return null;

  return (
    <text
      x={x + 12}
      y={y + height / 2}
      fill="#FFFFFF"
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={15}
      fontWeight={700}
    >
      {metricName} {formatter(value)}
      {yoyText && (
        <tspan fontSize={11} fontWeight={500} dy={0} dx={6} fill="rgba(255,255,255,0.9)">
          {yoyText}
        </tspan>
      )}
    </text>
  );
};

function MonthSlide({
  month,
  maxes,
  yoyMap,
}: {
  month: UnifiedMonthlyPaid;
  maxes: { maxLeads: number; maxSpend: number; maxCpl: number; maxClicks?: number };
  yoyMap: Record<string, YoYRow>;
}) {
  const narrative = monthNarrative(month);
  const events = getEventsForMonth(month.monthKey);
  const monthNumber = Number(month.monthKey.split("-")[1]);
  const focusNote =
    monthNumber >= 2 && monthNumber <= 9
      ? "Focus on website form submisions for high quality leads"
      : monthNumber >= 10 || monthNumber === 1
        ? "Focus on instand meta forms for volume of leads"
        : null;
  const chartData = [
    {
      name: month.monthLabel,
      paidLeads: month.paid.paidLeads ?? null,
      paidSpend: month.paid.paidSpend ?? null,
      paidCpl: month.paid.paidCpl ?? null,
    },
  ];

  const hasAny = chartData[0].paidLeads != null || chartData[0].paidSpend != null;

  // Color Logic
  const leadsYoY = month.paid.yoyLeads ?? "";
  const isLeadsPositive = leadsYoY.startsWith("+");
  const leadsColor = isLeadsPositive ? "#16a34a" : "#dc2626"; // Green-600 : Red-600

  const spendColor = "#64748B"; // Slate-500 (Grey)

  const cplYoY = month.paid.yoyCpl ?? "";
  const isCplPositive = cplYoY.startsWith("+");
  // CPL Increase is Bad (Red), Decrease is Good (Green)
  const cplColor = isCplPositive ? "#dc2626" : "#16a34a";

  return (
    <div className="grid grid-cols-2 gap-10">
      <div>
        <div className="relative mb-6 h-[260px] w-full overflow-visible">
          {hasAny ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} barCategoryGap={10} barGap={12} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0 0" stroke="transparent" />
                <XAxis type="number" xAxisId="leads" hide domain={[0, maxes.maxLeads]} />
                <XAxis type="number" xAxisId="currency" hide domain={[0, maxes.maxSpend]} />
                <XAxis type="number" xAxisId="cpl" hide domain={[0, maxes.maxCpl]} />
                <YAxis type="category" dataKey="name" hide width={0} />

                {/* Leads (Top) */}
                <Bar xAxisId="leads" dataKey="paidLeads" name="Total Leads" fill={leadsColor} radius={[0, 4, 4, 0]} barSize={60}>
                  <LabelList dataKey="paidLeads" content={(props: any) => renderLeftLabel(props, formatNumber, "Leads", month.paid.yoyLeads)} />
                </Bar>

                {/* CPL (Middle) */}
                <Bar xAxisId="cpl" dataKey="paidCpl" name="Avg CPL" fill={cplColor} radius={[0, 4, 4, 0]} barSize={60}>
                  <LabelList dataKey="paidCpl" content={(props: any) => renderLeftLabel(props, formatZar, "CPL", month.paid.yoyCpl)} />
                </Bar>

                {/* Spend (Bottom) */}
                <Bar xAxisId="currency" dataKey="paidSpend" name="Total Spend" fill={spendColor} radius={[0, 4, 4, 0]} barSize={60}>
                  <LabelList dataKey="paidSpend" content={(props: any) => renderLeftLabel(props, formatZar, "Spend", month.paid.yoySpend)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-p2 text-slate-500">—</div>
          )}
        </div>
        <p className="text-xs italic text-slate-500">*Avg CPL is not weighted, it is the average of all campaign totals</p>

        {/* Narrative moved below chart */}
        <p className="mt-6 text-sm leading-relaxed text-slate-700">{narrative}</p>

        {/* Best Performing Creative */}
        <div className="mt-8">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Best Performing Creative</h4>
          <div className="grid grid-cols-3 gap-4 bg-transparent outline-none border-0">
            <div className="relative w-full rounded-lg bg-slate-100 shadow-sm overflow-hidden border-0 outline-none">
              <Image
                src={`/Images/${month.monthLabel.split(' ')[0]}.png`}
                alt={`${month.monthLabel} Creative 1`}
                width={0}
                height={0}
                sizes="33vw"
                className="w-full h-auto"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="relative w-full rounded-lg bg-slate-100 shadow-sm overflow-hidden border-0 outline-none">
              <Image
                src={`/Images/${month.monthLabel.split(' ')[0]} 2.png`}
                alt={`${month.monthLabel} Creative 2`}
                width={0}
                height={0}
                sizes="33vw"
                className="w-full h-auto"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="relative w-full rounded-lg bg-slate-100 shadow-sm overflow-hidden border-0 outline-none">
              <Image
                src={`/Images/${month.monthLabel.split(' ')[0]} 3.png`}
                alt={`${month.monthLabel} Creative 3`}
                width={0}
                height={0}
                sizes="33vw"
                className="w-full h-auto"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        {focusNote && <p className="mb-3 text-xs italic text-slate-500">{focusNote}</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MetricsTable
            label="Meta"
            monthKey={month.monthKey}
            yoyMap={yoyMap}
            rows={[
              { label: "Leads", value: fmtMaybeNumber(month.meta?.metaLeads), metric: "Leads", showYoY: true },
              { label: "CPL", value: fmtMaybeCurrency(month.meta?.metaCpl), metric: "CPL", showYoY: true },
              { label: "Spend", value: fmtMaybeCurrency(month.meta?.metaSpend), metric: "Spend", showYoY: true },
              { label: "Clicks", value: fmtMaybeNumber(month.meta?.metaClicks), metric: "Clicks", showYoY: true },
            ]}
          />
          <MetricsTable
            label="Google"
            monthKey={month.monthKey}
            yoyMap={yoyMap}
            rows={[
              { label: "Leads", value: fmtMaybeNumber(month.google?.googleLeads), metric: "Leads", showYoY: true },
              { label: "CPL", value: fmtMaybeCurrency(month.google?.googleCpl), metric: "CPL", showYoY: true },
              { label: "Spend", value: fmtMaybeCurrency(month.google?.googleSpend), metric: "Spend", showYoY: true },
              { label: "Clicks", value: fmtMaybeNumber(month.google?.googleClicks), metric: "Clicks", showYoY: true },
            ]}
          />
        </div>

        {events.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Key Events</h4>
            {events.map((event) => (
              <div key={event.date + event.title} className="rounded-lg bg-white p-6 shadow-sm">
                <h5 className="mb-2 text-lg font-bold text-slate-900">{event.title}</h5>
                <p className="mb-4 text-sm text-slate-600 leading-relaxed">{event.description}</p>
                {event.outcome && (
                  <div className="rounded bg-white p-3 border border-slate-200">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Outcome</span>
                    <p className="text-xs font-medium text-slate-700">{event.outcome}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* September 2025 Special Note */}
        {month.monthLabel === "September 2025" && (
          <ul className="mt-8 list-disc pl-5 space-y-2 text-p2 text-slate-500 italic">
            <li>September 2024 Broadbrand took over as the primary agency</li>
            <li>2025 ran fully website leads campaigns for higher conversion rate while 2024 the campaigns were fully focused on instant form volume</li>
          </ul>
        )}

        {/* October 2025 Special Note */}
        {month.monthLabel === "October 2025" && (
          <ul className="mt-8 list-disc pl-5 space-y-2 text-p2 text-slate-500 italic">
            <li>Shift was made back to instant forms for higher lead volumes</li>
          </ul>
        )}
      </div>
    </div>
  );
}

const INTEREST_POINTS: InterestPoint[] = [
  { date: "2025-01-10", title: "Lead attribution visibility improved", description: "UTM source enhancements were introduced into the website-to-Zapier flow, improving clarity on lead origin and campaign performance.", outcome: "Stronger optimisation confidence during peak spend." },
  { date: "2025-01-16", title: "Peak January performance achieved", description: "Record-breaking sales days were reported, with overall enrolment nearing 90% of target by mid-month.", outcome: "January acquisition strategy validated during highest-demand window." },
  { date: "2025-01-30", title: "“Switching schools” creative launched", description: "Messaging was adapted to address parents dissatisfied with DBE placements, positioning SPARK as an alternative.", outcome: "Creative aligned to real-time parent sentiment late in peak season." },
  { date: "2025-02-03", title: "Enrolment infrastructure stabilisation", description: "Focus shifted from acquisition to fixing website, form, and integration issues surfaced during January peak.", outcome: "Reduced operational risk ahead of future enrolment cycles." },
  { date: "2025-03-11", title: "Lead quality strategy refined", description: "Meta instant forms were identified as a quality risk, prompting a shift toward website-based lead capture with stronger validation.", outcome: "Clear direction toward higher-quality lead sources." },
  { date: "2025-03-11", title: "Contact form routing clarified", description: "General contact forms were excluded from CRM ingestion and routed via ticketing instead.", outcome: "Cleaner CRM data and clearer internal workflows." },
  { date: "2025-04-23", title: "Bot and spam submissions blocked", description: "Form abuse was neutralised using Zapier-level validation and tighter submission logic.", outcome: "Cleaner CRM data and improved reporting accuracy." },
  { date: "2025-04-30", title: "Reporting discrepancies resolved", description: "A major variance between CRM and dashboards was traced to filtering logic rather than data loss.", outcome: "Trust in performance reporting fully re-established." },
  { date: "2025-05-22", title: "WhatsApp conversion channel", description: "Click-to-chat with pre-filled messaging was added to support faster handover to enrolment teams.", outcome: "Additional assisted-conversion pathway established." },
  { date: "2025-07-15", title: "Mid-year creative refresh", description: "Creative themes were updated to prevent fatigue and prepare audiences for the upcoming enrolment season.", outcome: "Engagement maintained heading into high-enrolment period." },
  { date: "2025-08-08", title: "Competition-led enrolment campaign", description: "Uniform incentive creatives were refined to balance promotional impact with brand CI and compliance.", outcome: "High-impact enrolment campaign approved and deployed." },
  { date: "2025-09-05", title: "Always-on enrolment campaigns", description: "Campaigns continued in structured, lower-intensity mode to capture late movers and planners.", outcome: "Baseline demand sustained throughout the season." },
  { date: "2025-11-10", title: "Late-stage enrolment messaging", description: "Messaging emphasised limited availability and final Open Days to convert undecided parents.", outcome: "Extended enrolment momentum deeper into the year." },
  { date: "2025-12-05", title: "High-intent enrolment demand", description: "December remained an active enrolment period, though delivery was affected by school closures and holiday behaviour.", outcome: "Momentum preserved heading into January peak." },
  { date: "2026-01-08", title: "Peak enrolment cycle repeated", description: "Insights from January 2025 informed tighter targeting, clearer messaging, and more disciplined spend.", outcome: "Strong start to the 2026 enrolment year." },
];

interface InterestPoint {
  date: string;
  title: string;
  description: string;
  outcome: string;
}

// Logic: An event in "2025-MM" appears in the month tab for "2025-MM".
function getEventsForMonth(monthKey: string) {
  const monthPrefix = monthKey.slice(0, 7); // "2025-07"
  return INTEREST_POINTS.filter(p => p.date.startsWith(monthPrefix));
}

export function MonthStoryScroller({ months, yoyMap }: MonthStoryScrollerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxes = useMemo(() => {
    let maxLeads = 0;
    let maxSpend = 0;
    let maxCpl = 0;
    months.forEach((month) => {
      const leads = month.paid.paidLeads ?? 0;
      const spend = month.paid.paidSpend ?? 0;
      const cpl = month.paid.paidCpl ?? 0;
      if (leads > maxLeads) maxLeads = leads;
      if (spend > maxSpend) maxSpend = spend;
      if (cpl > maxCpl) maxCpl = cpl;
    });
    return {
      maxLeads: maxLeads || 1,
      maxSpend: maxSpend || 1,
      maxCpl: maxCpl || 1,
    };
  }, [months]);

  const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(0, months.length - 1));
  const activeMonth = months[safeIndex];

  // Helper to handle month selection
  const handleMonthClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative mb-16 min-h-screen">
      <div className="mb-12 relative w-screen ml-[calc(50%-50vw)]">
        <div className="relative h-28 w-full">
          {/* Full width line */}
          <div className="absolute left-0 right-0 top-[109px] h-px w-full bg-slate-300" />

          {/* Pillbox Container */}
          <div className="max-w-[1400px] mx-auto px-10 h-full">
            <div className="flex items-start w-full justify-between">
              {months.map((month, index) => {
                const isLast = index === months.length - 1;

                return (
                  <div key={month.monthKey} className={`flex ${isLast ? '' : 'flex-1'} relative items-start group`}>
                    {/* Month Node */}
                    <div className="flex flex-col items-center relative z-10 gap-2 flex-none">
                      <button
                        type="button"
                        onClick={() => handleMonthClick(index)}
                        className={`relative z-10 h-24 w-14 p-1 rounded-[100px] border bg-white transition ${index === safeIndex ? "border-slate-700 shadow-sm" : "border-slate-300 hover:border-slate-500"
                          }`}
                        aria-pressed={index === safeIndex}
                      >
                        <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <span className="inline-block rotate-[270deg] whitespace-nowrap">
                            {month.monthLabel.split(' ')[0].slice(0, 3)}
                          </span>
                        </span>
                      </button>
                      <div className={`h-2.5 w-2.5 rounded-full border-2 bg-white transition z-20 ${index === safeIndex ? "border-slate-700 scale-125" : "border-slate-300 group-hover:border-slate-400"
                        }`} />
                    </div>

                    {/* Gap Segment with Interest Points */}
                    {/* Gap Segment (removed interest points, just spacing) */}
                    {!isLast && (
                      <div className="relative flex-1 h-32" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-10">
        <MonthSlide month={activeMonth} maxes={maxes} yoyMap={yoyMap} />
      </div>
    </section>
  );
}

const MONTH_NARRATIVES: Record<string, string> = {
  "January 2025": "January was a high-pressure, high-intensity enrolment month driven by urgency, limited grade availability, and a narrow window to hit sales targets. Campaigns were aggressively optimised toward entry grades (Grade R, 1 and Grade 8–10), with budgets actively shifted between Meta and Google as grades filled up and demand fluctuated. While lead volumes peaked mid-month due to strong market intent before schools opened, demand softened toward month-end as placements closed, requiring continuous creative refreshes and tighter targeting to sustain performance.",
  "February 2025": "February marked a transition from peak enrolment pressure into stabilisation and clean-up. Campaigns continued to capture late enrolments, particularly for parents delayed by district placement processes, while teams focused on resolving tracking, CRM, and website issues identified during January’s surge. Performance became more efficiency-driven, with tighter targeting, reduced urgency messaging, and an operational shift toward fixing systems, integrations, and foundations ahead of the next enrolment cycle.",
  "March 2025": "March was a consolidation month with reduced enrolment demand compared to Q1. Paid media activity focused on maintaining a baseline of qualified leads while monitoring performance rather than scaling aggressively. Attention shifted internally toward performance reporting, data accuracy, and learning extraction from the January peak to inform future planning, rather than driving volume at all costs.",
  "April 2025": "April saw lighter campaign activity as enrolment demand naturally softened. Paid media played a supporting role, ensuring consistent brand presence and lead trickle, while internal focus moved toward refining messaging, evaluating CPL trends, and preparing creative directions for upcoming open day initiatives. This month acted as a reset period following the intensity of Q1.",
  "May 2025": "May introduced renewed momentum through planning and creative preparation for upcoming open days. Campaign thinking shifted from enrolment urgency to event-led acquisition, with messaging and formats adapted to drive RSVPs rather than immediate applications. This period laid the groundwork for stronger performance in mid-year by aligning creative, budgets, and operational readiness.",
  "June 2025": "June was driven by open day promotion across primary and high school campaigns. Creative refreshes were rolled out, formats refined based on platform feedback, and budgets aligned to historically proven spend levels per school. The focus was on consistent execution and operational smoothness, with campaigns supporting attendance and awareness rather than peak enrolment conversion.",
  "July 2025": "July maintained steady paid media performance with a continued emphasis on open days and brand consistency. Creative formats were iterated based on prior learnings, ensuring alignment with brand CI and platform requirements. This month reflected operational maturity, fewer reactive changes, and more controlled campaign management compared to earlier in the year.",
  "August 2025": "August was characterised by creative refresh cycles and campaign refinement. New concepts were tested for competitions and open days, with strong emphasis on clarity, visual hierarchy, and brand alignment. Collaboration between marketing and creative teams improved execution speed, resulting in faster approvals and cleaner campaign rollouts.",
  "September 2025": "September focused on sustaining engagement through open days and promotional campaigns while balancing spend efficiency. Messaging evolved to remain relevant later in the year, and creative updates were implemented to prevent fatigue. Campaigns during this period prioritised quality touchpoints over volume, reinforcing long-term brand trust with prospective parents.",
  "October 2025": "October continued the steady rhythm established in late Q3, supporting open days and targeted campaigns without heavy scaling. Paid media performance remained stable, with incremental optimisations rather than structural changes. The emphasis was on consistency, clean data, and ensuring all campaigns aligned tightly with approved brand and messaging guidelines.",
  "November 2025": "November marked the build-up phase of peak enrolment season, with growing urgency from parents actively researching and shortlisting schools. Paid campaigns focused on sustained lead generation, setting a strong foundation of demand that carried into December and January. Meta contributed the larger share of paid leads as intent increased across entry grades.",
  "December 2025": "December remained a high-intent enrolment period, but campaign delivery was uneven due to the holiday season and reduced family availability. While demand for school placements was still present, shorter attention spans and time away from devices impacted consistency in lead flow. Meta continued to drive the majority of paid leads, but overall momentum was constrained by seasonal behaviour rather than campaign performance.",
  "January 2026": "January represented the peak enrolment period and the most commercially critical month of the cycle. Paid media was actively managed day-to-day, with budget shifts, creative refreshes, and targeting refinements applied in response to real-time demand, grade availability, and platform performance. Despite natural market tapering later in the month, campaigns delivered strong lead volumes under intense pressure, providing key insights that will directly inform optimisation, forecasting, and planning for the next enrolment season."
};

function monthNarrative(month: UnifiedMonthlyPaid): string {
  // Use specific narrative if available, otherwise fallback to generated one (though all should be covered)
  if (MONTH_NARRATIVES[month.monthLabel]) {
    return MONTH_NARRATIVES[month.monthLabel];
  }

  const metaLeads = month.meta?.metaLeads ?? null;
  const googleLeads = month.google?.googleLeads ?? null;
  const totalLeads = month.paid.paidLeads;
  const totalSpend = month.paid.paidSpend;
  const leadSource =
    metaLeads == null && googleLeads == null
      ? "No paid leads were recorded."
      : (metaLeads ?? 0) >= (googleLeads ?? 0)
        ? "Meta contributed the larger share of paid leads."
        : "Google contributed the larger share of paid leads.";

  return `${leadSource} The month closed with ${fmtMaybeNumber(totalLeads)} paid leads from ${fmtMaybeCurrency(
    totalSpend,
  )} total spend.`;
}




type MetricRowConfig = {
  label: string;
  value: string;
  metric?: "Leads" | "Spend" | "CPL" | "Clicks";
  showYoY: boolean;
};

function MetricsTable({
  rows,
  label,
  monthKey,
  yoyMap,
}: {
  rows: MetricRowConfig[];
  label: "Meta" | "Google";
  monthKey: string;
  yoyMap: Record<string, YoYRow>;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Image
          src={label === "Meta" ? "/Logos/meta.png" : "/Logos/google.png"}
          alt={label === "Meta" ? "Meta" : "Google"}
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </div>
      <table className="w-full text-p2 border-0">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="py-1 text-slate-600 align-top">{row.label}</td>
              <td className="py-1">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-semibold text-[var(--text)]">{row.value}</span>
                  {row.showYoY && row.metric
                    ? renderYoYLine(yoyMap, label, monthKey, row.metric)
                    : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] italic text-slate-500">All metric compared to previous year period</p>
    </div>
  );
}

function renderYoYLine(
  yoyMap: Record<string, YoYRow>,
  channel: "Meta" | "Google",
  monthKey: string,
  metric: "Leads" | "Spend" | "CPL" | "Clicks",
) {
  const key = `${channel}|${monthKey}|${metric}`;
  const row = yoyMap[key];
  if (!row) return null;

  const text = row.displayLabel ?? formatPct(row.percentDelta);
  if (!text) return null;

  let colorClass = "text-slate-500";
  const isPositive = text.startsWith("+");

  if (metric === "Leads" || metric === "Clicks") {
    colorClass = isPositive ? "text-green-600" : "text-red-600";
  } else if (metric === "CPL") {
    colorClass = isPositive ? "text-red-600" : "text-green-600";
  }

  return (
    <div className={`text-[11px] font-medium ${colorClass}`}>
      {text}
    </div>
  );
}

function formatDelta(metric: "Leads" | "Spend" | "CPL" | "Clicks", value: number | null): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const absValue = Math.abs(value);
  if (metric === "Spend" || metric === "CPL") {
    return `${sign}${formatZar(absValue)}`;
  }
  return `${sign}${formatNumber(absValue)}`;
}

function formatPct(value: number | null): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const absValue = Math.abs(value * 100);
  return `${sign}${absValue.toFixed(0)}%`;
}

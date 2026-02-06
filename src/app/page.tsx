import Image from "next/image";
import { KpiCard, ComparisonCard } from "@/components/report";
import { MonthStoryScroller } from "@/components/report/MonthStoryScroller";
import { formatNumber, formatPercent, formatZar } from "@/lib/format";
import { computeMetaComparisonTotals, computeMetaTotals } from "@/lib/meta/loadMeta";
import { computeGoogleComparisonTotals, computeGoogleTotals } from "@/lib/google/loadGoogle";
import { loadOrganicThankYouViews } from "@/lib/organic/loadOrganic";
import { loadUnifiedMonthlyPaidStory } from "@/lib/report/monthlyPaid";
import { loadYoY } from "@/lib/report/yoy";
import { getYoYDisplay } from "@/lib/yoy";

export default async function OverviewPage() {
  const meta = await computeMetaTotals();
  const metaPrev = await computeMetaComparisonTotals();
  const google = await computeGoogleTotals();
  const googlePrev = await computeGoogleComparisonTotals();
  const organicData = await loadOrganicThankYouViews();
  const monthlyStory = await loadUnifiedMonthlyPaidStory();
  const yoyMap = await loadYoY();

  const paidLeads = meta.metaLeads + google.googleLeads;
  const organicLeads = Math.max(0, organicData.thankYouPageViews - meta.metaPaidLeadsBb24 - google.googleLeads);
  const totalLeads = paidLeads + organicLeads;
  const paidSpend = meta.metaSpend + google.googleSpend;
  const paidClicks = meta.metaClicks + google.googleClicks;
  const paidImpressions = meta.metaImpressions + google.googleImpressions;
  const blendedCpl = paidLeads > 0 ? paidSpend / paidLeads : 0;
  const blendedAvgCpc = paidClicks > 0 ? paidSpend / paidClicks : 0;
  const blendedAvgCtr = paidImpressions > 0 ? paidClicks / paidImpressions : 0;

  const paidLeadsPrev = metaPrev.metaLeads + googlePrev.googleLeads;
  const paidSpendPrev = metaPrev.metaSpend + googlePrev.googleSpend;
  const paidClicksPrev = metaPrev.metaClicks + googlePrev.googleClicks;
  const paidImpressionsPrev = metaPrev.metaImpressions + googlePrev.googleImpressions;
  const blendedCplPrev = paidLeadsPrev > 0 ? paidSpendPrev / paidLeadsPrev : 0;
  const blendedAvgCpcPrev = paidClicksPrev > 0 ? paidSpendPrev / paidClicksPrev : 0;
  const blendedAvgCtrPrev = paidImpressionsPrev > 0 ? paidClicksPrev / paidImpressionsPrev : 0;

  const totalLeadsYoY = { absoluteChange: "—", percentChange: "—" };
  const organicLeadsYoY = { absoluteChange: "—", percentChange: "—" };
  const paidLeadsYoY = getYoYDisplay(paidLeads, paidLeadsPrev, "number");
  const paidSpendYoY = getYoYDisplay(paidSpend, paidSpendPrev, "currency");
  const blendedCplYoY = getYoYDisplay(blendedCpl, blendedCplPrev, "currency");
  const paidClicksYoY = getYoYDisplay(paidClicks, paidClicksPrev, "number");
  const blendedAvgCpcYoY = getYoYDisplay(blendedAvgCpc, blendedAvgCpcPrev, "currency");
  const blendedAvgCtrYoY = getYoYDisplay(blendedAvgCtr, blendedAvgCtrPrev, "ratio");
  const metaSpendYoY = getYoYDisplay(meta.metaSpend, metaPrev.metaSpend, "currency");
  const metaLeadsYoY = getYoYDisplay(meta.metaLeads, metaPrev.metaLeads, "number");
  const metaCplYoY = getYoYDisplay(meta.metaCpl, metaPrev.metaCpl, "currency");
  const googleSpendYoY = getYoYDisplay(google.googleSpend, googlePrev.googleSpend, "currency");
  const googleLeadsYoY = getYoYDisplay(google.googleLeads, googlePrev.googleLeads, "number");
  const googleCplYoY = getYoYDisplay(google.googleCpl, googlePrev.googleCpl, "currency");

  return (
    <>
      <main className="mx-auto max-w-[1400px] px-10 py-16">
        <header className="mb-16">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#801078]">Broadbrand Meta & Google Report</p>
            <h1 className="mb-2 font-extrabold text-[#2B0430]">
              Marketing Performance Review:
            </h1>
            <h2 className="mb-8 text-2xl font-extrabold text-slate-400">
              February 2025 - January 2026
            </h2>
          </div>

          <div className="max-w-5xl">
            <div>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Executive Summary</h3>
              <div className="leading-[1.3] text-slate-700 space-y-4">
                <p>
                  At the beginning of 2025, focus intentionally shifted toward lead quality, with tighter validation, improved tracking, and a cleanup of data flowing into the CRM. As peak enrolment season approached, the emphasis moved back toward lead volume, while maintaining stronger data integrity than in prior cycles.
                </p>
                <p>
                  The addition of an additional agency increased competition across shared audiences, placing upward pressure on costs and reducing marginal efficiency, particularly during peak demand periods.
                </p>
                <p>
                  Overall, the 2025 cycle reflects a transition from volume-led acquisition to a more disciplined, quality-driven approach early in the year, followed by a controlled return to scale during peak enrolment. Improved data integrity, clearer tracking, and closer alignment between marketing and enrolment teams have strengthened the foundation for future enrolment cycles.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-32 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <ComparisonCard
            label="Total Leads"
            metricLabel="Total Leads"
            v2025="31,386"
            v2024="36,464"
            yoy="Leads: -13.9% decrease"
            isIncreasePositive={true}
          />
          <ComparisonCard
            label="Total Spend"
            metricLabel="Total Spend"
            v2025="R3,124,310"
            v2024="R3,233,752"
            yoy="Spend: -3.4% decrease"
            isIncreasePositive={false}
          />
          <ComparisonCard
            label="Average CPL"
            metricLabel="Avg CPL"
            v2025="R99.54"
            v2024="R88.68"
            yoy="CPL: +12.2% increase"
            isIncreasePositive={false}
          />
          <ComparisonCard
            label="Total Clicks"
            metricLabel="Total Clicks"
            v2025="1,335,560"
            v2024="1,580,619"
            yoy="Clicks: -15.5% decrease"
            isIncreasePositive={true}
          />
          <ComparisonCard
            label="Total Website Form Submissions"
            metricLabel="Total Form Submissions"
            v2025="26,497"
            v2024="11,438"
            yoy="Form submissions +131.66% increase"
            isIncreasePositive={true}
          />
        </section>

        <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <h3 className="font-extrabold text-3xl">The year, month by month</h3>
          </div>
          <div className="flex justify-end">
            <p className="text-slate-600 max-w-md text-right text-p2">
              A comprehensive breakdown of month-over-month performance, highlighting key trends, paid media impact, and lead generation efficiency throughout the fiscal year.
            </p>
          </div>
        </section>

        <MonthStoryScroller months={monthlyStory.filter((m) => !m.monthLabel.includes("2024") && m.monthLabel !== "January 2025")} yoyMap={yoyMap} />

        <footer className="mt-20 border-t border-slate-200 pt-12 pb-1">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-6">
              <Image src="/Logos/SPARK logo.webp" alt="Spark Logo" width={94} height={24} className="h-6 w-auto opacity-30 grayscale" />
              <Image src="/Logos/broadbrand.png" alt="Broadbrand Logo" width={94} height={24} className="h-6 w-auto opacity-30 grayscale" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Board Report 2025/26 - SPARK Schools</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

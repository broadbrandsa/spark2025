import Link from "next/link";
import { notFound } from "next/navigation";
import { KpiCard, ReportSection } from "@/components/report";
import { formatNumber, formatPercent, formatZar } from "@/lib/format";
import type { SchoolPhase } from "@/lib/meta/attribution";
import { loadMetaSchoolBySlug } from "@/lib/meta/schools";

interface SchoolPageProps {
  params: Promise<{ school: string }>;
  searchParams: Promise<{ phase?: string }>;
}

function normalizePhase(input: string | undefined): SchoolPhase | null {
  if (!input) return null;
  const value = input.toLowerCase();
  if (value === "primary") return "Primary";
  if (value === "high") return "High";
  if (value === "all") return "All";
  return null;
}

export default async function SchoolPage({ params, searchParams }: SchoolPageProps) {
  const { school } = await params;
  const qp = await searchParams;
  const schoolData = await loadMetaSchoolBySlug(school);

  if (!schoolData) {
    notFound();
  }

  const requestedPhase = normalizePhase(qp.phase);
  const defaultPhase = schoolData.availablePhases.includes("All") ? "All" : schoolData.availablePhases[0];
  const activePhase = requestedPhase && schoolData.availablePhases.includes(requestedPhase)
    ? requestedPhase
    : defaultPhase;

  const phaseData = schoolData.phaseData[activePhase];
  if (!phaseData) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1400px] px-10 py-16">
      <section className="report-section">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-extrabold">{schoolData.displayName}</h1>
            <p className="mt-2 inline-flex rounded-full border border-[var(--accent-soft)] bg-[var(--accent-soft)]/20 px-3 py-1 text-p2 font-semibold text-[var(--text)]">
              {activePhase}
            </p>
          </div>

          {schoolData.availablePhases.length > 1 ? (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--accent-soft)] bg-white p-1">
              {schoolData.availablePhases.map((phase) => (
                <Link
                  key={phase}
                  href={`/schools/${schoolData.slug}?phase=${phase.toLowerCase()}`}
                  className={`rounded-lg px-3 py-1 text-p2 ${
                    activePhase === phase
                      ? "bg-[var(--accent-blue)] text-white"
                      : "text-[var(--text)] hover:bg-[var(--accent-soft)]/20"
                  }`}
                >
                  {phase}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Leads"
          value={formatNumber(phaseData.current.leadsTotal)}
          changeLine1={phaseData.yoy.leadsTotal.absoluteChange}
          changeLine2={phaseData.yoy.leadsTotal.percentChange}
        />
        <KpiCard
          label="Spend"
          value={formatZar(phaseData.current.spend)}
          changeLine1={phaseData.yoy.spend.absoluteChange}
          changeLine2={phaseData.yoy.spend.percentChange}
        />
        <KpiCard
          label="CPL"
          value={formatZar(phaseData.current.cpl)}
          changeLine1={phaseData.yoy.cpl.absoluteChange}
          changeLine2={phaseData.yoy.cpl.percentChange}
        />
        <KpiCard
          label="Clicks"
          value={formatNumber(phaseData.current.clicks)}
          changeLine1={phaseData.yoy.clicks.absoluteChange}
          changeLine2={phaseData.yoy.clicks.percentChange}
        />
        <KpiCard
          label="CTR"
          value={formatPercent(phaseData.current.ctr)}
          changeLine1={phaseData.yoy.ctr.absoluteChange}
          changeLine2={phaseData.yoy.ctr.percentChange}
        />
        <KpiCard
          label="CPC"
          value={formatZar(phaseData.current.cpc)}
          changeLine1={phaseData.yoy.cpc.absoluteChange}
          changeLine2={phaseData.yoy.cpc.percentChange}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ReportSection className="mb-0">
          <h3 className="mb-4 font-extrabold">Top Campaigns</h3>
          <div className="overflow-hidden rounded-xl border border-[var(--accent-soft)]">
            <table className="w-full text-left text-p2">
              <thead className="border-b border-[var(--accent-soft)] bg-[var(--accent-soft)]/20">
                <tr>
                  <th className="px-3 py-2">Campaign</th>
                  <th className="px-3 py-2 text-right">Leads</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">CPL</th>
                </tr>
              </thead>
              <tbody>
                {phaseData.topCampaigns.map((row) => (
                  <tr key={row.name} className="border-b border-[var(--accent-soft)]/70 last:border-b-0">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2 text-right">{formatNumber(row.leads)}</td>
                    <td className="px-3 py-2 text-right">{formatZar(row.spend)}</td>
                    <td className="px-3 py-2 text-right">{formatZar(row.cpl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>

        <ReportSection className="mb-0">
          <h3 className="mb-4 font-extrabold">Top Ad Sets</h3>
          <div className="overflow-hidden rounded-xl border border-[var(--accent-soft)]">
            <table className="w-full text-left text-p2">
              <thead className="border-b border-[var(--accent-soft)] bg-[var(--accent-soft)]/20">
                <tr>
                  <th className="px-3 py-2">Ad Set</th>
                  <th className="px-3 py-2 text-right">Leads</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">CPL</th>
                </tr>
              </thead>
              <tbody>
                {phaseData.topAdSets.map((row) => (
                  <tr key={row.name} className="border-b border-[var(--accent-soft)]/70 last:border-b-0">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2 text-right">{formatNumber(row.leads)}</td>
                    <td className="px-3 py-2 text-right">{formatZar(row.spend)}</td>
                    <td className="px-3 py-2 text-right">{formatZar(row.cpl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>
      </div>
    </main>
  );
}

import { formatNumber, formatZar } from "@/lib/format";
import { loadMetaSchoolsData } from "@/lib/meta/schools";
import { SchoolsTableClient } from "./SchoolsTableClient";

export default async function SchoolsPage() {
  const data = await loadMetaSchoolsData();

  const rows = data.schools.map((school) => ({
    slug: school.slug,
    name: school.displayName,
    phase: school.phaseLabel,
    leads: formatNumber(school.listMetrics.leadsTotal),
    spend: formatZar(school.listMetrics.spend),
    cpl: formatZar(school.listMetrics.cpl),
    clicks: formatNumber(school.listMetrics.clicks),
  }));

  return (
    <main className="mx-auto max-w-[1400px] px-10 py-16">
      <section className="report-section">
        <h1 className="font-extrabold">Schools</h1>
        <p className="mt-3 max-w-3xl text-p2 text-slate-600">
          Meta-attributed school performance using ad set naming as the current source of truth.
        </p>
      </section>

      <section className="report-section">
        <SchoolsTableClient rows={rows} />
      </section>
    </main>
  );
}

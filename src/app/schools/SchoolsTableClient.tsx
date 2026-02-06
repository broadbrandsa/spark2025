"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface SchoolListRow {
  slug: string;
  name: string;
  phase: string;
  leads: string;
  spend: string;
  cpl: string;
  clicks: string;
}

interface SchoolsTableClientProps {
  rows: SchoolListRow[];
}

export function SchoolsTableClient({ rows }: SchoolsTableClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;

    return rows.filter((row) => `${row.name} ${row.phase}`.toLowerCase().includes(normalized));
  }, [query, rows]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search schools"
        className="mb-5 w-full rounded-xl border border-[var(--accent-soft)] bg-white px-3 py-2 text-p2 outline-none"
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--accent-soft)] bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-[var(--accent-soft)] bg-[var(--accent-soft)]/20 text-p2 text-slate-700">
            <tr>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3 text-right">Leads</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">CPL</th>
              <th className="px-4 py-3 text-right">Clicks</th>
            </tr>
          </thead>
          <tbody className="text-p2">
            {filtered.map((row) => (
              <tr key={row.slug} className="border-b border-[var(--accent-soft)]/70 last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/schools/${row.slug}`} className="text-[var(--text)] hover:text-[var(--accent-blue)]">
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.phase}</td>
                <td className="px-4 py-3 text-right">{row.leads}</td>
                <td className="px-4 py-3 text-right">{row.spend}</td>
                <td className="px-4 py-3 text-right">{row.cpl}</td>
                <td className="px-4 py-3 text-right">{row.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

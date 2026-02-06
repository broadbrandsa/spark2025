"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SchoolSummary } from "@/lib/data";

interface SchoolIndexClientProps {
  schools: SchoolSummary[];
}

export function SchoolIndexClient({ schools }: SchoolIndexClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return schools;
    }

    return schools.filter((school) => {
      const label = `${school.name} ${school.phase}`.toLowerCase();
      return label.includes(normalized);
    });
  }, [query, schools]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="school-search" className="mb-2 block text-sm font-medium text-gray-700">
          Search schools
        </label>
        <input
          id="school-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by school name or phase"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((school) => (
          <li key={school.slug} className="rounded border border-gray-200 p-4">
            <Link href={`/schools/${school.slug}`} className="text-base font-medium text-gray-900 hover:underline">
              {school.name}
            </Link>
            <p className="mt-1 text-sm text-gray-600">Phase: {school.phase}</p>
            <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-3">
              <p>Total Leads: {school.summary.totalLeads}</p>
              <p>Paid Leads: {school.summary.paidLeads}</p>
              <p>Organic Leads: {school.summary.organicLeads}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/section";
import { CompanyCard } from "@/components/company-card";
import { COMPANIES } from "@/lib/data";

const INDUSTRIES = Array.from(new Set(COMPANIES.map((c) => c.industry))).sort();

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");

  const q = query.trim().toLowerCase();
  const filtered = COMPANIES.filter((c) => {
    if (industry !== "all" && c.industry !== industry) return false;
    if (!q) return true;
    return (c.name + " " + c.about + " " + c.city).toLowerCase().includes(q);
  });

  return (
    <Section className="py-12">
      <SectionTitle
        eyebrow="Компании Кубани"
        title="Бизнес региона — открыт к стажёрам"
        description="МСП и крупные компании Краснодарского края, которые публикуют проекты и проводят бизнес-экскурсии."
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          placeholder="Поиск по названию или ценности компании…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
        >
          <option value="all">Все отрасли</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
      </div>
    </Section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Section, SectionTitle } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS, COMPANIES, DEMO_STUDENT } from "@/lib/data";
import { matchProjects } from "@/lib/ai";

type FormatFilter = "all" | "офлайн" | "онлайн" | "гибрид";
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [city, setCity] = useState<string>("all");
  const [aiMode, setAiMode] = useState(true);

  const matches = useMemo(() => matchProjects(DEMO_STUDENT, PROJECTS.length), []);
  const matchById = useMemo(() => {
    const map = new Map<string, { score: number; reasons: string[] }>();
    matches.forEach((m) => map.set(m.project.id, { score: m.score, reasons: m.reasons }));
    return map;
  }, [matches]);

  const cities = Array.from(new Set(PROJECTS.map((p) => p.city))).sort();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PROJECTS.filter((p) => {
      if (format !== "all" && p.format !== format) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (city !== "all" && p.city !== city) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.summary,
        p.description,
        p.skills.join(" "),
        p.tags.join(" "),
        COMPANIES.find((c) => c.id === p.companyId)?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    if (aiMode) {
      list = [...list].sort((a, b) => {
        const sa = matchById.get(a.id)?.score ?? 0;
        const sb = matchById.get(b.id)?.score ?? 0;
        return sb - sa;
      });
    }
    return list;
  }, [query, format, difficulty, city, aiMode, matchById]);

  return (
    <Section className="py-12">
      <SectionTitle
        eyebrow="Каталог проектов"
        title="Реальные кейсы компаний Краснодарского края"
        description="Фильтруй по формату, городу и уровню. Включи AI-режим, чтобы лента сортировалась по совпадению с твоим профилем."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] items-end">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterInput
            label="Поиск"
            placeholder="ML, маркетинг, BIM…"
            value={query}
            onChange={setQuery}
          />
          <FilterSelect
            label="Формат"
            value={format}
            onChange={(v) => setFormat(v as FormatFilter)}
            options={[
              ["all", "Любой"],
              ["офлайн", "Офлайн"],
              ["онлайн", "Онлайн"],
              ["гибрид", "Гибрид"],
            ]}
          />
          <FilterSelect
            label="Уровень"
            value={difficulty}
            onChange={(v) => setDifficulty(v as DifficultyFilter)}
            options={[
              ["all", "Любой"],
              ["beginner", "Старт"],
              ["intermediate", "Средний"],
              ["advanced", "Продвинутый"],
            ]}
          />
          <FilterSelect
            label="Город"
            value={city}
            onChange={setCity}
            options={[
              ["all", "Любой город края"],
              ...cities.map((c) => [c, c] as [string, string]),
            ]}
          />
        </div>
        <label className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-medium cursor-pointer hover:border-brand-300">
          <input
            type="checkbox"
            checked={aiMode}
            onChange={(e) => setAiMode(e.target.checked)}
            className="accent-brand-600"
          />
          <span className="grid place-items-center h-6 w-6 rounded-md bg-brand-600 text-white text-[10px] font-bold">
            AI
          </span>
          Сортировка по AI-совпадению
        </label>
      </div>

      <div className="mt-4 text-sm text-muted">
        Найдено: <b className="text-ink">{filtered.length}</b> из {PROJECTS.length}{" "}
        {aiMode && "· отсортировано по AI-матчингу"}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const m = matchById.get(p.id);
          return (
            <ProjectCard
              key={p.id}
              project={p}
              matchScore={aiMode ? m?.score : undefined}
              matchReasons={aiMode ? m?.reasons : undefined}
            />
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-muted">Ничего не нашлось. Попробуй смягчить фильтры.</p>
          </div>
        )}
      </div>
    </Section>
  );
}

function FilterInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-muted mb-1">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-muted mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

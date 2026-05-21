import Link from "next/link";
import { getCompany, type Project } from "@/lib/data";

const DIFFICULTY: Record<Project["difficulty"], { label: string; color: string }> = {
  beginner: { label: "Старт", color: "bg-brand-50 text-brand-700" },
  intermediate: { label: "Средний", color: "bg-ochre-100 text-ochre-700" },
  advanced: { label: "Продвинутый", color: "bg-sea-50 text-sea-700" },
};

export function ProjectCard({
  project,
  matchScore,
  matchReasons,
}: {
  project: Project;
  matchScore?: number;
  matchReasons?: string[];
}) {
  const company = getCompany(project.companyId);
  const diff = DIFFICULTY[project.difficulty];
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition shadow-soft hover:-translate-y-0.5 hover:border-brand-300"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid place-items-center h-8 w-8 rounded-lg text-white text-xs font-bold"
            style={{ background: company?.logoColor ?? "#0E6E4E" }}
          >
            {(company?.shortName ?? "?").slice(0, 2)}
          </span>
          <div>
            <div className="text-xs text-muted">{company?.shortName ?? "Компания"}</div>
            <div className="text-[11px] text-muted/80">{project.city}</div>
          </div>
        </div>
        <span className={"rounded-full px-2.5 py-0.5 text-[11px] font-semibold " + diff.color}>
          {diff.label}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand-700">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-muted line-clamp-3">{project.summary}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="Длительность" value={`${project.durationWeeks} нед.`} />
        <Stat label="Команда" value={`${project.teamSize.min}–${project.teamSize.max}`} />
        <Stat label="Стипендия" value={`${(project.stipend / 1000).toFixed(0)}к ₽`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-md bg-paper px-2 py-0.5 text-[11px] text-ink/70 border border-line"
          >
            {s}
          </span>
        ))}
        {project.skills.length > 3 && (
          <span className="text-[11px] text-muted">+{project.skills.length - 3}</span>
        )}
      </div>

      {typeof matchScore === "number" && (
        <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-800">AI-совпадение</span>
            <span className="text-brand-700 font-bold">{matchScore}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-brand-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>
          {matchReasons && matchReasons.length > 0 && (
            <p className="mt-2 text-[11px] leading-snug text-brand-800/80">
              {matchReasons[0]}
            </p>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted">
        <span>{project.applications} заявок · мест: {project.capacity}</span>
        <span className="text-brand-700 font-semibold group-hover:underline">Открыть →</span>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="text-sm font-bold text-ink">{value}</div>
    </div>
  );
}

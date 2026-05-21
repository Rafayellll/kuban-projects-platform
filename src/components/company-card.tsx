import Link from "next/link";
import { type Company, getProjectsByCompany } from "@/lib/data";

export function CompanyCard({ company }: { company: Company }) {
  const projects = getProjectsByCompany(company.id);
  return (
    <Link
      href={`/companies/${company.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition shadow-soft hover:-translate-y-0.5 hover:border-brand-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center h-11 w-11 rounded-xl text-white text-sm font-bold"
            style={{ background: company.logoColor }}
          >
            {company.shortName.slice(0, 2)}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold leading-tight text-ink group-hover:text-brand-700">
              {company.name}
            </h3>
            <div className="text-xs text-muted mt-0.5">
              {company.industry} · {company.city}
            </div>
          </div>
        </div>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted border border-line">
          {company.size}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted line-clamp-3">{company.about}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.values.slice(0, 3).map((v) => (
          <span
            key={v}
            className="rounded-md bg-ochre-50 px-2 py-0.5 text-[11px] text-ochre-700"
          >
            {v}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-xs">
        <span className="text-muted">
          {projects.length} {plural(projects.length, ["проект", "проекта", "проектов"])} ·{" "}
          {company.excursionAvailable ? "есть экскурсия" : "без экскурсий"}
        </span>
        <span className="text-brand-700 font-semibold group-hover:underline">Открыть →</span>
      </div>
    </Link>
  );
}

function plural(n: number, forms: [string, string, string]): string {
  const m100 = n % 100;
  const m10 = n % 10;
  if (m100 >= 11 && m100 <= 14) return forms[2];
  if (m10 === 1) return forms[0];
  if (m10 >= 2 && m10 <= 4) return forms[1];
  return forms[2];
}

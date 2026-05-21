import Link from "next/link";
import { Section, SectionTitle } from "@/components/section";
import { COMPANIES, PROJECTS, getCompany, DEMO_STUDENT } from "@/lib/data";
import { matchProjects } from "@/lib/ai";

const FEATURED_COMPANY_ID = "magnit";

export default function DashboardPage() {
  const company = getCompany(FEATURED_COMPANY_ID)!;
  const projects = PROJECTS.filter((p) => p.companyId === FEATURED_COMPANY_ID);

  const topCandidates = matchProjects(DEMO_STUDENT, PROJECTS.length).filter((m) =>
    projects.some((p) => p.id === m.project.id),
  );

  return (
    <Section className="py-12">
      <SectionTitle
        eyebrow={`Кабинет компании · ${company.name}`}
        title="Управление проектами и кадровым резервом"
        description="Демо-кабинет менеджера компании. Здесь вы создаёте кейсы, видите заявки с AI-скорингом и отслеживаете эффект."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Активных кейсов" value={projects.filter((p) => p.status === "open").length} delta="+2 за неделю" />
        <KPI label="Заявок (мес.)" value={projects.reduce((s, p) => s + p.applications, 0)} delta="+18 %" />
        <KPI label="AI-скоринг 80+" value={topCandidates.filter((m) => m.score >= 80).length} delta="" />
        <KPI label="Найм после проекта" value="38 %" delta="vs 12 % без платформы" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="headline text-2xl">Мои кейсы</h2>
            <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              + Создать кейс
            </button>
          </div>
          <div className="mt-4 divide-line rounded-2xl border border-line bg-white">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-semibold text-ink hover:text-brand-700 truncate block"
                  >
                    {p.title}
                  </Link>
                  <div className="text-xs text-muted mt-0.5">
                    {p.applications} заявок · {p.capacity} мест · дедлайн{" "}
                    {new Date(p.deadline).toLocaleDateString("ru-RU")}
                  </div>
                </div>
                <span
                  className={
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold " +
                    (p.status === "open"
                      ? "bg-brand-50 text-brand-700"
                      : p.status === "in_progress"
                        ? "bg-ochre-100 text-ochre-700"
                        : "bg-sea-50 text-sea-700")
                  }
                >
                  {p.status === "open" ? "Набор открыт" : p.status === "in_progress" ? "В работе" : "Завершён"}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mt-12 headline text-2xl">AI-шортлист кандидатов</h2>
          <p className="mt-1 text-sm text-muted">
            Демо: топ-3 студентов по проекту «{projects[0]?.title}». В проде список
            формируется по совпадению профиля и описанию кейса, плюс бизнес-веса.
          </p>
          <div className="mt-4 grid gap-3">
            {[
              { name: "Артём К.", uni: "КубГУ, 3 курс", score: 92, why: "Совпали Python, SQL, продуктовая аналитика" },
              { name: "Мария Л.", uni: "КубГТУ, 4 курс", score: 86, why: "ML, ритейл; есть учебный проект по recsys" },
              { name: "Даниил С.", uni: "КубГУ, 2 курс", score: 78, why: "Базовый Python, силён в визуализации данных" },
            ].map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-2xl border border-line bg-white p-4"
              >
                <span
                  className="grid place-items-center h-11 w-11 rounded-full text-white text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${156 + i * 40} 50% 40%), hsl(${156 + i * 40 + 30} 60% 55%))`,
                  }}
                >
                  {c.name
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted">{c.uni}</div>
                  <div className="text-[11px] text-muted mt-0.5">AI: {c.why}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-700">{c.score}%</div>
                  <div className="mt-1 h-1.5 w-20 rounded-full bg-brand-100 overflow-hidden">
                    <div className="h-full bg-brand-600" style={{ width: `${c.score}%` }} />
                  </div>
                </div>
                <button className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">
                  Пригласить
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">Эффект для компании</div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li className="flex justify-between">
                <span>Среднее время до найма</span>
                <span className="font-semibold text-ink">▼ 38 %</span>
              </li>
              <li className="flex justify-between">
                <span>Качество кандидатов (1–5)</span>
                <span className="font-semibold text-ink">4.3</span>
              </li>
              <li className="flex justify-between">
                <span>Удержание после оффера 6 мес.</span>
                <span className="font-semibold text-ink">▲ 22 %</span>
              </li>
              <li className="flex justify-between">
                <span>NPS наставника</span>
                <span className="font-semibold text-ink">+62</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">Все компании на платформе</div>
            <p className="mt-2 text-xs text-muted">
              Хотите получить кабинет? Напишите нам, и мы заведём вашу карточку и
              откроем доступ менеджеру.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {COMPANIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/companies/${c.id}`}
                  className="rounded-md bg-paper px-2 py-1 text-[11px] border border-line hover:border-brand-300"
                >
                  {c.shortName}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function KPI({ label, value, delta }: { label: string; value: number | string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="text-3xl font-extrabold tracking-tight text-brand-700">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
      {delta && <div className="text-[11px] text-ochre-700 mt-1">{delta}</div>}
    </div>
  );
}

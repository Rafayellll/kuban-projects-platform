import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { DEMO_STUDENT, PROJECTS, getCompany, getProject } from "@/lib/data";
import { matchProjects, scoreApplication } from "@/lib/ai";
import { ProjectCard } from "@/components/project-card";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

const FORMAT_LABEL: Record<string, string> = {
  офлайн: "Офлайн",
  онлайн: "Онлайн",
  гибрид: "Гибрид",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const company = getCompany(project.companyId);
  const { score, explanation } = scoreApplication(DEMO_STUDENT, project);

  const similar = matchProjects(DEMO_STUDENT, PROJECTS.length)
    .map((m) => m.project)
    .filter((p) => p.id !== project.id && p.tags.some((t) => project.tags.includes(t)))
    .slice(0, 3);

  return (
    <Section className="py-12">
      <Link href="/projects" className="text-sm text-brand-700 hover:underline">
        ← Все проекты
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article>
          <div className="flex items-center gap-3">
            <span
              className="grid place-items-center h-12 w-12 rounded-xl text-white font-bold"
              style={{ background: company?.logoColor }}
            >
              {company?.shortName.slice(0, 2)}
            </span>
            <div>
              <Link
                href={`/companies/${company?.id}`}
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                {company?.name}
              </Link>
              <div className="text-xs text-muted">
                {company?.industry} · {project.city} · {FORMAT_LABEL[project.format]}
              </div>
            </div>
          </div>

          <h1 className="headline mt-4 text-3xl sm:text-4xl text-ink">{project.title}</h1>
          <p className="mt-3 text-lg text-muted max-w-2xl">{project.summary}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Длительность" value={`${project.durationWeeks} нед.`} />
            <Stat label="Команда" value={`${project.teamSize.min}–${project.teamSize.max} чел.`} />
            <Stat label="Стипендия" value={`${project.stipend.toLocaleString("ru-RU")} ₽`} />
            <Stat label="Дедлайн заявок" value={fmtDate(project.deadline)} />
          </div>

          <Block title="О проекте">
            <p className="text-ink/90">{project.description}</p>
          </Block>

          <Block title="Что получишь">
            <p className="text-ink/90">{project.outcome}</p>
          </Block>

          <Block title="Навыки и инструменты">
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line bg-white px-3 py-1 text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </Block>

          <Block title="Ментор от компании">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="grid place-items-center h-12 w-12 rounded-full bg-ochre-300 text-ochre-900 font-bold">
                {project.mentor.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </span>
              <div>
                <div className="font-semibold">{project.mentor.name}</div>
                <div className="text-sm text-muted">{project.mentor.role}</div>
              </div>
            </div>
          </Block>

          <Block title="Процесс по неделям">
            <ol className="grid gap-3 sm:grid-cols-2">
              {generatePlan(project.durationWeeks).map((step, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-line bg-white p-4"
                >
                  <div className="text-xs font-mono text-brand-600">Неделя {i + 1}</div>
                  <div className="mt-1 font-semibold">{step.title}</div>
                  <div className="text-sm text-muted mt-1">{step.text}</div>
                </li>
              ))}
            </ol>
          </Block>
        </article>

        <aside className="lg:sticky lg:top-24 self-start space-y-5">
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-brand-800">AI-совпадение</span>
              <span className="text-brand-700 font-bold text-lg">{score}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-brand-100 overflow-hidden">
              <div
                className="h-full bg-brand-600"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-brand-800/80">{explanation}</p>
            <p className="mt-3 text-[11px] text-brand-800/60">
              Подсчитано на демо-профиле «{DEMO_STUDENT.fullName}». На проде
              учитывается твой реальный профиль и история.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">Заявка на участие</div>
            <div className="mt-3 text-xs text-muted">
              {project.applications} заявок · {project.capacity} {plural(project.capacity, ["место", "места", "мест"])}
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-paper overflow-hidden">
              <div
                className="h-full bg-ochre-400"
                style={{
                  width: `${Math.min(100, (project.applications / Math.max(1, project.capacity * 10)) * 100)}%`,
                }}
              />
            </div>
            <button className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Подать заявку командой
            </button>
            <button className="mt-2 w-full rounded-xl bg-white border border-line px-4 py-2.5 text-sm font-semibold hover:border-brand-300">
              Сохранить в избранное
            </button>
            <p className="mt-3 text-[11px] text-muted">
              После подачи — короткое интервью с AI-куратором, далее ментор
              приглашает в команду или предлагает резерв.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">О компании</div>
            <p className="mt-2 text-sm text-muted">{company?.about}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {company?.values.map((v) => (
                <span
                  key={v}
                  className="rounded-md bg-ochre-50 px-2 py-0.5 text-[11px] text-ochre-700"
                >
                  {v}
                </span>
              ))}
            </div>
            <Link
              href={`/companies/${company?.id}`}
              className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
            >
              Открыть страницу компании →
            </Link>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="headline text-2xl">Похожие проекты</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-0.5 text-base font-bold">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-bold uppercase tracking-wider text-muted">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

function generatePlan(weeks: number) {
  const base = [
    { title: "Kick-off + знакомство", text: "Старт, цели спринта, знакомство с командой и ментором." },
    { title: "Исследование", text: "Изучаем данные, документацию и контекст бизнеса." },
    { title: "Прототип / первая итерация", text: "Готовим первый рабочий артефакт." },
    { title: "Промежуточное ревью", text: "Чек-поинт с ментором, корректировка плана." },
    { title: "Финальный артефакт", text: "Дорабатываем, проверяем качество." },
    { title: "Демо-день", text: "Защита перед командой компании, обратная связь." },
    { title: "Бейдж и портфолио", text: "Получаешь цифровой бейдж и материал для резюме." },
    { title: "Расширение", text: "Опционально — продолжение в полноценную стажировку." },
  ];
  return base.slice(0, Math.min(Math.max(weeks, 2), base.length));
}

function plural(n: number, forms: [string, string, string]): string {
  const m100 = n % 100;
  const m10 = n % 10;
  if (m100 >= 11 && m100 <= 14) return forms[2];
  if (m10 === 1) return forms[0];
  if (m10 >= 2 && m10 <= 4) return forms[1];
  return forms[2];
}

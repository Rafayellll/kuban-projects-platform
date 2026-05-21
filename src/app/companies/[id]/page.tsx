import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { COMPANIES, getCompany, getProjectsByCompany } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const projects = getProjectsByCompany(company.id);

  return (
    <Section className="py-12">
      <Link href="/companies" className="text-sm text-brand-700 hover:underline">
        ← Все компании
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
        <div>
          <div className="flex items-center gap-4">
            <span
              className="grid place-items-center h-16 w-16 rounded-2xl text-white text-xl font-bold"
              style={{ background: company.logoColor }}
            >
              {company.shortName.slice(0, 2)}
            </span>
            <div>
              <h1 className="headline text-3xl sm:text-4xl text-ink">{company.name}</h1>
              <div className="mt-1 text-sm text-muted">
                {company.industry} · {company.city} · {company.size} компания
              </div>
            </div>
          </div>

          <p className="mt-6 text-base text-ink/90 max-w-3xl">{company.about}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {company.values.map((v) => (
              <span
                key={v}
                className="rounded-full bg-ochre-100 px-3 py-1 text-sm text-ochre-800"
              >
                {v}
              </span>
            ))}
          </div>

          {company.excursionAvailable && (
            <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-brand-800">Бизнес-экскурсия открыта</div>
                <p className="text-sm text-brand-800/80">
                  Группа до 12 человек, длительность 2 часа. Знакомство с командой,
                  технологиями и культурой компании.
                </p>
              </div>
              <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Записаться на экскурсию
              </button>
            </div>
          )}

          <h2 className="mt-12 headline text-2xl">Проекты и мини-стажировки</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
            {projects.length === 0 && (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
                Пока нет открытых проектов. Подпишись, чтобы получить уведомление.
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">Карточка компании</div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Отрасль" value={company.industry} />
              <Row label="Город" value={company.city} />
              <Row label="Размер" value={company.size} />
              <Row
                label="Открытых проектов"
                value={`${projects.filter((p) => p.status === "open").length}`}
              />
              <Row label="Экскурсии" value={company.excursionAvailable ? "да" : "нет"} />
              {company.website && (
                <Row
                  label="Сайт"
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      открыть ↗
                    </a>
                  }
                />
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="text-sm font-semibold">Поддерживает миссию</div>
            <p className="mt-2 text-sm text-muted">
              {company.shortName} помогает развивать кадровый резерв
              Краснодарского края: предоставляет реальные проекты, наставников и
              оплачивает мини-стажировки.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted text-xs uppercase tracking-wider">{label}</dt>
      <dd className="text-ink text-sm font-medium">{value}</dd>
    </div>
  );
}

import Link from "next/link";
import { Section, SectionTitle } from "@/components/section";
import { DEMO_STUDENT, getProject, getCompany } from "@/lib/data";
import { matchProjects } from "@/lib/ai";
import { ProjectCard } from "@/components/project-card";

const APP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Подана", color: "bg-paper text-muted border-line" },
  invited: { label: "Приглашены в команду", color: "bg-ochre-100 text-ochre-800 border-ochre-200" },
  joined: { label: "В работе", color: "bg-brand-100 text-brand-800 border-brand-200" },
  done: { label: "Завершён", color: "bg-sea-50 text-sea-700 border-sea-200" },
};

export default function ProfilePage() {
  const profile = DEMO_STUDENT;
  const matches = matchProjects(profile, 4);

  return (
    <Section className="py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] items-start">
        <aside className="rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-4">
            <div
              className="grid place-items-center h-16 w-16 rounded-2xl text-white text-xl font-bold"
              style={{
                background: `linear-gradient(135deg, hsl(${profile.avatarHue} 50% 40%), hsl(${profile.avatarHue + 30} 60% 55%))`,
              }}
            >
              {profile.fullName
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
            <div>
              <h1 className="font-bold text-lg">{profile.fullName}</h1>
              <div className="text-sm text-muted">
                {profile.university}, {profile.year} курс
              </div>
              <div className="text-xs text-muted">{profile.city}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">{profile.bio}</p>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-muted">Навыки</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-brand-50 px-2 py-0.5 text-xs text-brand-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wider text-muted">Интересы</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.interests.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-ochre-50 px-2 py-0.5 text-xs text-ochre-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-muted">Бейджи</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs"
                >
                  <span>{b.emoji}</span>
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
            Редактировать профиль
          </button>
        </aside>

        <div>
          <SectionTitle
            eyebrow="Мой профиль"
            title="Привет, Артём!"
            description="Вот твоя AI-подборка проектов и текущие заявки. Цифровой профиль обновляется автоматически по результатам твоей активности."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Counter label="Заявок подано" value={profile.applications.length} accent="brand" />
            <Counter label="Бейджей получено" value={profile.badges.length} accent="ochre" />
            <Counter label="AI-совпадений 80%+" value={matches.filter((m) => m.score >= 80).length} accent="sea" />
          </div>

          <h2 className="mt-12 headline text-2xl">Активные заявки</h2>
          <div className="mt-4 grid gap-3">
            {profile.applications.map((a) => {
              const p = getProject(a.projectId);
              const c = p ? getCompany(p.companyId) : undefined;
              const meta = APP_STATUS_LABELS[a.status];
              if (!p) return null;
              return (
                <Link
                  key={a.projectId}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 hover:border-brand-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="grid place-items-center h-10 w-10 rounded-lg text-white text-xs font-bold shrink-0"
                      style={{ background: c?.logoColor }}
                    >
                      {c?.shortName.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-ink truncate">{p.title}</div>
                      <div className="text-xs text-muted">
                        {c?.shortName} · обновлено {fmt(a.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold border " + meta.color
                    }
                  >
                    {meta.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <h2 className="mt-12 headline text-2xl">AI-подборка для тебя</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {matches.map((m) => (
              <ProjectCard
                key={m.project.id}
                project={m.project}
                matchScore={m.score}
                matchReasons={m.reasons}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Counter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "brand" | "ochre" | "sea";
}) {
  const colors = {
    brand: "bg-brand-50 text-brand-800",
    ochre: "bg-ochre-100 text-ochre-800",
    sea: "bg-sea-50 text-sea-700",
  } as const;
  return (
    <div className={"rounded-2xl p-4 " + colors[accent]}>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

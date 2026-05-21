import Link from "next/link";
import { Section, SectionTitle } from "@/components/section";
import { COMPANIES, PROJECTS, DEMO_STUDENT } from "@/lib/data";
import { matchProjects } from "@/lib/ai";
import { ProjectCard } from "@/components/project-card";

const HERO_STATS = [
  { value: "165К+", label: "студентов края" },
  { value: "7 000+", label: "компаний" },
  { value: "12 нед.", label: "до первого опыта" },
  { value: "5", label: "AI-сценариев" },
];

const PROBLEMS = [
  {
    title: "Поздний контакт с работой",
    text: "Студенты встречаются с реальными компаниями только на 3–4 курсе через формальную практику.",
    emoji: "⏳",
  },
  {
    title: "Сухие вакансии вместо опыта",
    text: "Job-сайты показывают зарплату, но не показывают, как выглядит работа изнутри.",
    emoji: "📝",
  },
  {
    title: "73 % не уверены в выборе",
    text: "Молодые люди выбирают профессию вслепую, без возможности «попробовать на вкус».",
    emoji: "🤷‍♀️",
  },
  {
    title: "Компании теряют талант",
    text: "Краснодарский край каждый год теряет выпускников, которые уезжают за «настоящей» карьерой.",
    emoji: "🛫",
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "AI-профориентатор",
    text: "Короткий диалог 5 минут. ИИ собирает интересы, навыки, формат — и рисует траекторию.",
  },
  {
    n: "02",
    title: "AI-матчинг проектов",
    text: "Получаешь 3–5 проектов под профиль с пояснением «почему именно этот».",
  },
  {
    n: "03",
    title: "Бизнес-экскурсия + кейс",
    text: "Идёшь на экскурсию в компанию или сразу подаёшь заявку в команду на проект.",
  },
  {
    n: "04",
    title: "Мини-стажировка 2–8 недель",
    text: "Команда, ментор, чек-поинты, AI-куратор. На выходе — портфолио и рекомендация.",
  },
];

const AI_SCENARIOS = [
  {
    title: "AI-профориентатор",
    text: "Диалоговый помощник, который собирает интересы и подбирает направление.",
    tech: "LLM (GigaChat / YandexGPT)",
  },
  {
    title: "AI-матчинг проектов",
    text: "Семантическая близость профиля и описания проекта + бизнес-правила региона.",
    tech: "multilingual-e5 + pgvector",
  },
  {
    title: "AI-куратор",
    text: "Разбирает блокеры в проекте, предлагает шаги, эскалирует сложное ментору.",
    tech: "LLM + RAG (методички)",
  },
  {
    title: "AI-скоринг кандидатов",
    text: "Компания получает шортлист с объяснением, какие навыки совпали.",
    tech: "Embeddings + классификатор",
  },
  {
    title: "AI-ревью артефактов",
    text: "Черновик ревью результата для ментора + красные флаги по чек-листу.",
    tech: "LLM + правила",
  },
];

export default function HomePage() {
  const featuredMatches = matchProjects(DEMO_STUDENT, 3);
  const featuredCompanies = COMPANIES.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <Section className="pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ochre-100 px-3 py-1 text-xs font-semibold text-ochre-700">
              <span className="h-1.5 w-1.5 rounded-full bg-ochre-500" />
              Кейс «Проектный вход в компании региона» · блок B
            </div>
            <h1 className="headline mt-5 text-5xl sm:text-6xl leading-[1.05] text-ink">
              Попробуй профессию в компании{" "}
              <span className="text-brand-700">Кубани</span> — а не угадывай по
              вакансиям.
            </h1>
            <p className="mt-5 text-lg text-muted max-w-xl">
              ПроКубань — единая платформа мини-стажировок и проектной
              деятельности. Знакомим молодёжь региона с реальными компаниями
              через короткие командные проекты. ИИ подбирает лучшее совпадение.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700 transition"
              >
                Найти проект под себя
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full bg-white border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-brand-300 hover:text-brand-700 transition"
              >
                Я представитель компании
              </Link>
              <Link
                href="/about#ai"
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                Как работает AI →
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white border border-line p-4">
                  <dt className="text-2xl headline text-brand-700">{s.value}</dt>
                  <dd className="text-xs text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroCard />
        </div>
      </Section>

      {/* PROBLEMS */}
      <Section className="py-16">
        <SectionTitle
          eyebrow="Проблема"
          title="Между молодёжью и компаниями региона — пропасть"
          description="Сегодня знакомство с работой происходит слишком поздно и через сухие форматы. Платформа закрывает разрыв."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-2xl">{p.emoji}</div>
              <h3 className="mt-3 font-semibold text-ink">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="py-16">
        <SectionTitle
          eyebrow="Как работает платформа"
          title="От «не знаю, кем стать» до защищённого проекта — за 4 шага"
        />
        <ol className="mt-10 grid gap-4 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s, i) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-line bg-white p-5 overflow-hidden"
            >
              <div className="text-xs font-mono text-brand-600">{s.n}</div>
              <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-brand-300">
                  →
                </div>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* AI BLOCK */}
      <section id="ai" className="bg-brand-700 text-white py-20 mt-16">
        <Section>
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-ochre-300" />
                AI-ядро
              </div>
              <h2 className="headline mt-3 text-3xl sm:text-4xl">
                ИИ — основа платформы,<br /> а не «чат сбоку»
              </h2>
              <p className="mt-4 text-white/80 max-w-md">
                Мы используем минимум 5 AI-сценариев, которые встроены в
                ключевые процессы продукта. Это превращает платформу из
                «доски объявлений» в персонального карьерного навигатора.
              </p>
              <div className="mt-6 space-y-1.5 text-sm text-white/80">
                <div>• Российский стек: GigaChat / YandexGPT (152-ФЗ).</div>
                <div>• Open-source fallback: Qwen / Llama.</div>
                <div>• Векторный поиск на pgvector.</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {AI_SCENARIOS.map((s, i) => (
                <div
                  key={s.title}
                  className="rounded-2xl bg-white/5 border border-white/15 p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid place-items-center h-7 w-7 rounded-md bg-ochre-300 text-brand-900 text-xs font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-white/85">{s.text}</p>
                  <div className="mt-2 text-[11px] font-mono text-ochre-200">{s.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* FEATURED PROJECTS */}
      <Section className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="AI-подборка"
            title="Топ-3 проекта под демо-профиль"
            description="Профиль: студент 3 курса КубГУ, Python + аналитика. ИИ пересчитывает в реальном времени для каждого пользователя."
          />
          <Link
            href="/projects"
            className="rounded-full bg-white border border-line px-4 py-2 text-sm font-semibold hover:border-brand-300 hover:text-brand-700"
          >
            Все {PROJECTS.length} проектов →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredMatches.map((m) => (
            <ProjectCard
              key={m.project.id}
              project={m.project}
              matchScore={m.score}
              matchReasons={m.reasons}
            />
          ))}
        </div>
      </Section>

      {/* COMPANIES STRIP */}
      <Section className="py-16">
        <SectionTitle
          eyebrow="Компании региона"
          title="Они уже открыты к мини-стажировкам"
          description="МСП, средний и крупный бизнес Краснодарского края — публикуют проекты и проводят экскурсии."
        />
        <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {featuredCompanies.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className="rounded-2xl border border-line bg-white p-4 hover:border-brand-300 transition flex flex-col gap-3"
            >
              <span
                className="grid place-items-center h-10 w-10 rounded-lg text-white text-xs font-bold"
                style={{ background: c.logoColor }}
              >
                {c.shortName.slice(0, 2)}
              </span>
              <div>
                <div className="text-sm font-semibold text-ink leading-tight">{c.shortName}</div>
                <div className="text-[11px] text-muted mt-0.5">{c.industry}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20">
        <div className="rounded-3xl bg-kuban bg-grid border border-line p-10 sm:p-14 text-center">
          <h2 className="headline text-3xl sm:text-4xl">
            Готов попробовать профессию <span className="text-brand-700">по-настоящему</span>?
          </h2>
          <p className="mt-3 text-muted max-w-2xl mx-auto">
            Заполни короткий профиль, ИИ подберёт 3 проекта Краснодарского края,
            а первый чек-поинт у тебя будет уже на этой неделе.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
            >
              Начать
            </Link>
            <Link
              href="/about"
              className="rounded-full bg-white border border-line px-6 py-3 text-sm font-semibold hover:border-brand-300 hover:text-brand-700"
            >
              Узнать больше об архитектуре
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-ochre-200 via-brand-200 to-sea-200 blur-2xl opacity-60" aria-hidden />
      <div className="relative rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-brand-600 text-white text-xs font-bold">
              AI
            </span>
            <div>
              <div className="text-sm font-bold">AI-матчинг</div>
              <div className="text-[11px] text-muted">3 совпадения · в режиме реального времени</div>
            </div>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
            демо-профиль
          </span>
        </div>

        <div className="rounded-xl bg-paper border border-line p-3 text-xs">
          <div className="text-muted">Профиль</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {["Python", "SQL", "Аналитика данных", "Figma"].map((s) => (
              <span key={s} className="rounded-md bg-white border border-line px-1.5 py-0.5">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {[
            { t: "Рекомендательная витрина акций «Магнит»", c: "Магнит", s: 92 },
            { t: "Skoring lite в КубаньКредите", c: "КубаньКредит", s: 87 },
            { t: "Мини-исследование маршрутов «Тандер»", c: "Тандер", s: 81 },
          ].map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-xl border border-line p-2.5 hover:border-brand-300 transition"
            >
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-ink truncate">{m.t}</div>
                <div className="text-[11px] text-muted">{m.c}</div>
              </div>
              <div className="shrink-0 grid place-items-center w-14">
                <div className="text-sm font-bold text-brand-700">{m.s}%</div>
                <div className="mt-0.5 h-1 w-12 rounded-full bg-brand-100 overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${m.s}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-100 p-3 text-[12px] text-brand-800">
          <span className="grid place-items-center h-6 w-6 rounded-full bg-brand-600 text-white text-[10px] font-bold">
            i
          </span>
          ИИ объясняет: совпадение по навыкам Python и аналитике, та же локация — Краснодар.
        </div>
      </div>
    </div>
  );
}

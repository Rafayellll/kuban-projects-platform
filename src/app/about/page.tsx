import Link from "next/link";
import { Section, SectionTitle } from "@/components/section";

const ARCH = [
  { tag: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "Tailwind v4", "Telegram Mini App"] },
  { tag: "API / BFF", items: ["Route Handlers", "REST + WebSocket", "OAuth (Госуслуги, VK ID)"] },
  { tag: "Сервисы", items: ["users-svc", "companies-svc", "projects-svc", "teams-svc", "mentors-svc", "ai-svc"] },
  { tag: "Данные", items: ["PostgreSQL + pgvector", "Redis", "S3 (Yandex Object Storage)"] },
  { tag: "AI", items: ["GigaChat / YandexGPT API", "multilingual-e5 embeddings", "RAG по методичкам"] },
  { tag: "Деплой", items: ["Vercel / Yandex Cloud", "Sentry", "Posthog"] },
];

const AI_SCENARIOS = [
  {
    n: "01",
    title: "AI-профориентатор",
    text: "LLM с системным промптом и набором инструментов: задаёт вопросы, агрегирует ответы, рисует траекторию.",
    data: "профиль, ответы на онбординг, история взаимодействий",
  },
  {
    n: "02",
    title: "AI-матчинг студент ↔ проект",
    text: "Эмбеддинги профиля и кейса в pgvector; cosine + бизнес-веса (регион, оплата, формат).",
    data: "профиль студента, описание проекта, навыки",
  },
  {
    n: "03",
    title: "AI-куратор",
    text: "Чат-помощник во время проекта: декомпозирует блокеры, эскалирует ментору, напоминает о дедлайнах.",
    data: "контекст проекта, чек-листы, методички (RAG)",
  },
  {
    n: "04",
    title: "AI-скоринг кандидатов",
    text: "Шортлист и пояснение для менеджера компании: какие навыки совпали, какие риски.",
    data: "профили кандидатов, кейс, история проектов",
  },
  {
    n: "05",
    title: "AI-ревью артефактов",
    text: "Черновик отзыва ментора и красные флаги по чек-листу качества (ясность, полнота, метрики).",
    data: "артефакт, чек-лист компании",
  },
];

const PEST_HIGHLIGHTS = [
  { title: "Политика", text: "Нацпроект «Образование», региональные программы, 152-ФЗ, поддержка отечественного ПО." },
  { title: "Экономика", text: "Дефицит кадров 4,8 млн чел., рост HRTech +25 %/год, активный МСП в крае." },
  { title: "Социум", text: "Gen Z ценит опыт > диплома; 73 % студентов не уверены в выборе; mobile-first." },
  { title: "Технологии", text: "Доступные LLM (GigaChat, YandexGPT), pgvector, Telegram Mini Apps, RuTube/Kinescope." },
];

const PARTNERS = [
  "КубГУ", "КубГТУ", "КубГАУ", "КГУФКСТ",
  "Минэк края", "Минобр края", "АСИ", "Профстажировки 2.0",
];

const ROADMAP = [
  { stage: "MVP-1 (хакатон)", weeks: "12 ч", goal: "Лента, профиль, AI-чат, AI-матчинг" },
  { stage: "MVP-2", weeks: "1 мес.", goal: "Команды, чек-поинты, портфолио, дашборд" },
  { stage: "Пилот в Краснодаре", weeks: "3 мес.", goal: "5–10 компаний, 200+ студентов, 50+ завершённых" },
  { stage: "Масштаб по краю", weeks: "12 мес.", goal: "Все МО края, TG Mini App, мобилка" },
  { stage: "Юг РФ", weeks: "18 мес.", goal: "Ростов, Ставрополь, Адыгея, Крым" },
];

export default function AboutPage() {
  return (
    <>
      <Section className="py-12">
        <SectionTitle
          eyebrow="О платформе"
          title="ПроКубань — единая экосистема входа в работу"
          description="Платформа покрывает сквозной путь молодого человека: профориентация → знакомство с компанией → проект → мини-стажировка → найм. Блок B (мини-стажировки) — наш фокус."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: "+5", l: "AI-сценариев" },
            { v: "9", l: "доменных сервисов" },
            { v: "100 %", l: "соответствие 152-ФЗ" },
            { v: "MVP за 12 ч", l: "плюс полноценный план до года" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-3xl headline text-brand-700">{s.v}</div>
              <div className="text-xs text-muted mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* AI */}
      <Section id="ai" className="py-12">
        <SectionTitle
          eyebrow="AI-ядро"
          title="ИИ — не «чат сбоку», а контракт-ориентированные функции"
          description="Минимум 5 AI-сценариев встроены в ключевые процессы. У каждого — чёткий вход, выход и метрика качества."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_SCENARIOS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-xs font-mono text-brand-600">{s.n}</div>
              <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-muted">данные</div>
              <div className="text-xs text-ink">{s.data}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture */}
      <Section className="py-12">
        <SectionTitle
          eyebrow="Архитектура"
          title="Микросервисная экосистема с единым AI-ядром"
          description="MVP реализован как Next.js-приложение с разделением по модулям. В перспективе модули выносятся в самостоятельные сервисы."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARCH.map((g) => (
            <div key={g.tag} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-[11px] uppercase tracking-wider text-brand-700 font-semibold">
                {g.tag}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {g.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <div className="text-sm font-semibold">Соответствие 152-ФЗ</div>
          <p className="mt-2 text-sm text-muted">
            Хостинг и БД в РФ, согласие при регистрации, отдельная роль «школьник»
            с подтверждением родителя, маскирование ПДн перед отправкой в LLM,
            логирование промптов в шифрованную БД.
          </p>
        </div>
      </Section>

      {/* PEST */}
      <Section className="py-12">
        <SectionTitle
          eyebrow="Внешний контекст"
          title="PEST-силы: ветер в спину"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PEST_HIGHLIGHTS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-white p-5">
              <div className="font-bold text-ink">{p.title}</div>
              <p className="mt-2 text-sm text-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Подробный анализ — в репозитории <code className="font-mono text-xs bg-paper px-1 py-0.5 rounded">docs/01-analytics.md</code>.
        </p>
      </Section>

      {/* Partners */}
      <Section id="partners" className="py-12">
        <SectionTitle eyebrow="Партнёры" title="Кому интересно подключиться" />
        <div className="mt-6 flex flex-wrap gap-2">
          {PARTNERS.map((p) => (
            <span key={p} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
              {p}
            </span>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section className="py-12">
        <SectionTitle eyebrow="Развитие" title="Дорожная карта продукта" />
        <ol className="mt-8 grid gap-3">
          {ROADMAP.map((r, i) => (
            <li
              key={r.stage}
              className="grid grid-cols-[auto_1fr_auto] gap-4 items-center rounded-2xl border border-line bg-white p-4"
            >
              <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-600 text-white text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold">{r.stage}</div>
                <div className="text-sm text-muted">{r.goal}</div>
              </div>
              <div className="text-xs text-muted">{r.weeks}</div>
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <div className="rounded-3xl bg-brand-700 text-white p-10 sm:p-14 text-center">
          <h2 className="headline text-3xl sm:text-4xl">Хотите запустить пилот в своей компании?</h2>
          <p className="mt-3 text-white/85 max-w-2xl mx-auto">
            Мы открыты к партнёрству с компаниями Краснодарского края, вузами и
            региональными программами молодёжной политики.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-white text-brand-700 px-5 py-3 text-sm font-semibold hover:bg-ochre-50"
            >
              Кабинет компании
            </Link>
            <Link
              href="/projects"
              className="rounded-full bg-brand-600 border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Каталог проектов
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

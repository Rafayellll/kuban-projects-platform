/**
 * AI-ядро MVP.
 *
 * 1. matchProjects(profile) — рекомендательный матчинг студента и проектов
 *    (упрощённый TF-подход + бизнес-веса; в проде — multilingual-e5 + pgvector).
 * 2. scoreApplication(profile, project) — скоринг заявки кандидата.
 * 3. chatCompletion(messages) — обёртка для LLM, поддерживает несколько
 *    провайдеров (OpenAI-совместимые: GigaChat / YandexGPT / OpenAI).
 *    Если ключа нет — работает офлайн-симулятор для демо.
 */

import { PROJECTS, type Project, type StudentProfile, getCompany } from "@/lib/data";

type Tokenized = Map<string, number>;

const STOP_WORDS = new Set([
  "и", "в", "на", "с", "для", "по", "что", "как", "не", "это", "у",
  "от", "до", "из", "за", "к", "о", "об", "при", "the", "a", "an",
]);

function tokenize(text: string): Tokenized {
  const map: Tokenized = new Map();
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+#./-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOP_WORDS.has(t))
    .forEach((t) => map.set(t, (map.get(t) ?? 0) + 1));
  return map;
}

function cosine(a: Tokenized, b: Tokenized): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  a.forEach((va) => (na += va * va));
  b.forEach((vb) => (nb += vb * vb));
  a.forEach((va, k) => {
    const vb = b.get(k);
    if (vb) dot += va * vb;
  });
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export type MatchedProject = {
  project: Project;
  score: number; // 0..100
  reasons: string[];
};

/**
 * AI-матчинг.
 * Считает базовое сходство + бизнес-правила:
 *   + город совпадает
 *   + есть пересечение по навыкам
 *   + уровень сложности подходит курсу
 *   + проект ещё открыт
 */
export function matchProjects(profile: StudentProfile, topN = 5): MatchedProject[] {
  const profileText = [
    profile.major,
    profile.skills.join(" "),
    profile.interests.join(" "),
    profile.bio,
  ].join(" ");
  const profileTokens = tokenize(profileText);

  const scored: MatchedProject[] = PROJECTS.filter((p) => p.status === "open").map((project) => {
    const projectText = [
      project.title,
      project.summary,
      project.description,
      project.skills.join(" "),
      project.tags.join(" "),
      getCompany(project.companyId)?.about ?? "",
    ].join(" ");
    const projectTokens = tokenize(projectText);
    const sim = cosine(profileTokens, projectTokens); // 0..1

    const reasons: string[] = [];
    let bonus = 0;

    // skill overlap
    const skillSet = new Set(profile.skills.map((s) => s.toLowerCase()));
    const overlap = project.skills.filter((s) => skillSet.has(s.toLowerCase()));
    if (overlap.length > 0) {
      bonus += 0.18 * Math.min(overlap.length, 3);
      reasons.push(`совпадение по навыкам: ${overlap.slice(0, 3).join(", ")}`);
    }

    if (profile.city && project.city.toLowerCase() === profile.city.toLowerCase()) {
      bonus += 0.06;
      reasons.push(`та же локация — ${profile.city}`);
    }

    // interests alignment
    const interestText = profile.interests.join(" ").toLowerCase();
    const tagHit = project.tags.find((t) => interestText.includes(t.toLowerCase()));
    if (tagHit) {
      bonus += 0.05;
      reasons.push(`в интересах есть «${tagHit}»`);
    }

    // difficulty fit
    const desiredDifficulty =
      profile.year <= 2 ? "beginner" : profile.year === 3 ? "intermediate" : "advanced";
    if (project.difficulty === desiredDifficulty) {
      bonus += 0.05;
      reasons.push(`сложность подходит ${profile.year}-му курсу`);
    }

    const total = Math.min(1, sim * 0.75 + bonus);
    const score = Math.round(total * 100);

    if (reasons.length === 0) {
      reasons.push("ИИ оценил по описанию профиля и проекта");
    }

    return { project, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

export function scoreApplication(profile: StudentProfile, project: Project): { score: number; explanation: string } {
  const [match] = matchProjects(
    { ...profile },
    PROJECTS.length,
  ).filter((m) => m.project.id === project.id);
  if (!match) return { score: 50, explanation: "Базовая оценка." };
  const explanation = match.reasons.join("; ");
  return { score: match.score, explanation };
}

/* -------------------------------------------------------------------------- */
/*                                 Chat layer                                 */
/* -------------------------------------------------------------------------- */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Ты — AI-ассистент платформы «ПроКубань» для молодёжи Краснодарского края.
Задачи:
  • профориентация (помоги выбрать направление);
  • рекомендация проектов и мини-стажировок региона;
  • поддержка во время выполнения проекта.
Тон: дружелюбный, конкретный, без воды. Отвечай на русском.
Если пользователь спрашивает что-то вне платформы — мягко возвращай в контекст карьеры и проектов.
Не выдумывай вакансии и не давай юридических, медицинских или политических советов.`;

type ProviderResult = { ok: true; content: string } | { ok: false; error: string };

async function callOpenAICompatible(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<ProviderResult> {
  try {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return { ok: false, error: "empty response" };
    return { ok: true, content };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

export async function chatCompletion(messages: ChatMessage[]): Promise<{ content: string; source: string }> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiBase = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const openaiModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (openaiKey) {
    const r = await callOpenAICompatible(openaiBase, openaiKey, openaiModel, messages);
    if (r.ok) return { content: r.content, source: `openai:${openaiModel}` };
    console.warn("[ai] openai-compatible failed:", r.error);
  }

  // Fallback — детерминированный демо-симулятор, чтобы MVP всегда работал.
  return { content: simulateAssistant(messages), source: "demo-simulator" };
}

/* -------------------------------------------------------------------------- */
/*                           Offline demo simulator                           */
/* -------------------------------------------------------------------------- */

function pick<T>(arr: T[], n = 3): T[] {
  return arr.slice(0, Math.min(n, arr.length));
}

function describeMatches(): string {
  const matches = matchProjects(
    {
      id: "u-anon",
      fullName: "Гость",
      city: "Краснодар",
      university: "—",
      year: 2,
      major: "Прикладная информатика",
      skills: ["Python", "Аналитика данных", "SQL"],
      interests: ["AI", "ритейл", "данные"],
      bio: "Студент, интересуюсь данными и ИИ.",
      avatarHue: 156,
      badges: [],
      applications: [],
    },
    3,
  );
  return matches
    .map(
      (m, i) =>
        `${i + 1}. **${m.project.title}** (${getCompany(m.project.companyId)?.shortName}) — совпадение ${m.score} %.` +
        ` Почему: ${m.reasons.slice(0, 2).join("; ")}.`,
    )
    .join("\n");
}

export function simulateAssistant(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.toLowerCase() ?? "";

  if (!lastUser || lastUser.length < 2) {
    return [
      "Привет! Я AI-ассистент ПроКубани.",
      "Могу помочь:",
      "• подобрать проект или мини-стажировку под твой профиль;",
      "• рассказать о компании Краснодарского края;",
      "• помочь определиться с направлением.",
      "С чего начнём?",
    ].join("\n");
  }

  if (/(привет|здравств|hi|hello)/i.test(lastUser)) {
    return "Привет! Я ассистент ПроКубани. Расскажи коротко о себе — курс, что нравится, и я подберу 3 проекта.";
  }

  if (/(подбер|подобр|рекоменд|какой проект|что подходит|посовет)/.test(lastUser)) {
    return [
      "Готово, вот мой топ-3 по твоему запросу:",
      "",
      describeMatches(),
      "",
      "Хочешь — могу объяснить любой из них подробнее или показать карточку проекта.",
    ].join("\n");
  }

  if (/(компани|где работать|организац|агрокомплекс|магнит|тандер|sirius|стройплюс)/.test(lastUser)) {
    const comps = pick(["Магнит", "Тандер", "Sirius IT", "Агрокомплекс", "КубаньКредит", "Кубань.Тур"], 5);
    return [
      "В Краснодарском крае много интересных работодателей. Несколько примеров:",
      ...comps.map((c) => `• **${c}** — открыты к стажёрам, есть проекты на платформе`),
      "",
      "Открой раздел «Компании», чтобы увидеть карточки и доступные экскурсии.",
    ].join("\n");
  }

  if (/(не знаю|не реш|какую профес|кем стать|куда пойти|выбрать направ)/.test(lastUser)) {
    return [
      "Ок, давай по шагам:",
      "1. Что у тебя получается лучше всего: считать, общаться, делать руками, придумывать?",
      "2. Что тебя «зажигает» — техника, бизнес, люди, природа, искусство?",
      "3. Готов ли ты пробовать короткие проекты, чтобы понять «на вкус»?",
      "",
      "Ответь хотя бы на 1–2 вопроса — я предложу 2–3 трека и проекты под них.",
    ].join("\n");
  }

  if (/(данн|аналит|python|sql|ml|ai|ии|llm)/.test(lastUser)) {
    return [
      "Под направление «данные / AI» в Кубани есть несколько хороших стартов:",
      "",
      "• **Магнит** — рекомендательные системы и аналитика покупок.",
      "• **Sirius IT** — LLM в EdTech, прототипы помощников.",
      "• **КубаньКредит** — скоринг и продуктовая аналитика.",
      "",
      "Хочешь подобрать проект под нужный уровень сложности?",
    ].join("\n");
  }

  if (/(маркет|smm|контент|реклам|бренд)/.test(lastUser)) {
    return [
      "Под маркетинг есть мини-стажировки:",
      "• **Юг-Авто** — CRM-сценарии возврата клиентов.",
      "• **Кубань.Тур** — продвижение нового туристического маршрута.",
      "• **ЭдуКубань** — контент-фабрика TikTok.",
      "",
      "Открой раздел «Проекты» с фильтром «маркетинг» — там полный список.",
    ].join("\n");
  }

  if (/(стажиров|практик|опыт)/.test(lastUser)) {
    return [
      "Мини-стажировка на ПроКубани — это 2–8 недель, командно, с ментором компании и оплатой.",
      "После завершения ты получаешь:",
      "— цифровой бейдж и запись в портфолио;",
      "— рекомендательное письмо от компании;",
      "— приоритет на постоянные позиции.",
      "",
      "Хочешь — подберу под твой курс и навыки.",
    ].join("\n");
  }

  if (/(спасибо|thanks|благодарю)/.test(lastUser)) {
    return "Пожалуйста! Если что-то ещё нужно — я рядом. И не забудь заглянуть в «Проекты», там сегодня обновили подборку.";
  }

  // generic
  return [
    "Понял. Уточню вопрос, чтобы помочь точнее:",
    "• какой ты курс / класс?",
    "• какие 2–3 темы интересны?",
    "• хочешь больше «руками» или больше «анализировать»?",
    "",
    "На основе ответа предложу 2–3 проекта Краснодарского края.",
  ].join("\n");
}

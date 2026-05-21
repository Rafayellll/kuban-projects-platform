/**
 * Тестовые данные для MVP «ПроКубань».
 * В проде заменяется на Prisma + PostgreSQL + pgvector.
 */

export type Industry =
  | "IT"
  | "Агропром"
  | "Ритейл"
  | "FinTech"
  | "Логистика"
  | "Маркетинг"
  | "Туризм"
  | "Строительство"
  | "Медиа"
  | "EdTech";

export type Company = {
  id: string;
  name: string;
  shortName: string;
  industry: Industry;
  city: string;
  size: "малая" | "средняя" | "крупная";
  about: string;
  values: string[];
  excursionAvailable: boolean;
  logoColor: string;
  cover: string;
  website?: string;
};

export type ProjectStatus = "open" | "in_progress" | "done";

export type Project = {
  id: string;
  companyId: string;
  title: string;
  summary: string;
  description: string;
  skills: string[];
  format: "офлайн" | "онлайн" | "гибрид";
  city: string;
  durationWeeks: number;
  teamSize: { min: number; max: number };
  stipend: number; // rub
  deadline: string; // ISO
  status: ProjectStatus;
  applications: number;
  capacity: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  outcome: string; // что получит студент
  mentor: { name: string; role: string };
  tags: string[];
};

export type StudentProfile = {
  id: string;
  fullName: string;
  city: string;
  university: string;
  year: number;
  major: string;
  skills: string[];
  interests: string[];
  bio: string;
  avatarHue: number;
  badges: { id: string; label: string; emoji: string; date: string }[];
  applications: { projectId: string; status: "new" | "invited" | "joined" | "done"; updatedAt: string }[];
};

export const COMPANIES: Company[] = [
  {
    id: "magnit",
    name: "Магнит",
    shortName: "Магнит",
    industry: "Ритейл",
    city: "Краснодар",
    size: "крупная",
    about:
      "Один из крупнейших ритейлеров России, родом из Краснодара. Открыты к стажёрам в data, аналитике, маркетинге и логистике.",
    values: ["масштаб", "технологичность", "региональная гордость"],
    excursionAvailable: true,
    logoColor: "#E30613",
    cover: "/covers/magnit.svg",
    website: "https://magnit.ru",
  },
  {
    id: "tander",
    name: "Тандер",
    shortName: "Тандер",
    industry: "Логистика",
    city: "Краснодар",
    size: "крупная",
    about:
      "Логистический оператор группы «Магнит». Открыты направления: оптимизация маршрутов, складская аналитика, IoT.",
    values: ["надёжность", "масштаб", "оптимизация"],
    excursionAvailable: true,
    logoColor: "#C8102E",
    cover: "/covers/tander.svg",
  },
  {
    id: "yug-avto",
    name: "Юг-Авто",
    shortName: "Юг-Авто",
    industry: "Ритейл",
    city: "Краснодар",
    size: "средняя",
    about:
      "Крупнейший автохолдинг Юга России. Цифровизация клиентского опыта, маркетинг, CRM, продажи.",
    values: ["клиентский сервис", "скорость", "доверие"],
    excursionAvailable: true,
    logoColor: "#0033A0",
    cover: "/covers/yug-avto.svg",
  },
  {
    id: "kuban-cred",
    name: "КубаньКредит",
    shortName: "КубаньКредит",
    industry: "FinTech",
    city: "Краснодар",
    size: "средняя",
    about:
      "Региональный банк. Развивают мобильный банк, скоринг и продукты для МСП Краснодарского края.",
    values: ["надёжность", "локальность", "клиентоцентричность"],
    excursionAvailable: true,
    logoColor: "#003D7A",
    cover: "/covers/kuban-cred.svg",
  },
  {
    id: "agrokomplex",
    name: "Агрокомплекс им. Н. Ткачёва",
    shortName: "Агрокомплекс",
    industry: "Агропром",
    city: "Выселки",
    size: "крупная",
    about:
      "Вертикально-интегрированный агрохолдинг. Точечное земледелие, агроэкономика, переработка.",
    values: ["земля", "технологии", "семья"],
    excursionAvailable: true,
    logoColor: "#2E7D32",
    cover: "/covers/agro.svg",
  },
  {
    id: "sirius-it",
    name: "Sirius IT",
    shortName: "Sirius IT",
    industry: "IT",
    city: "Сочи",
    size: "средняя",
    about:
      "IT-резидент Сириуса. Разработка ML-продуктов, веб-сервисов, edtech.",
    values: ["инженерия", "наука", "скорость"],
    excursionAvailable: false,
    logoColor: "#5B5BD6",
    cover: "/covers/sirius.svg",
  },
  {
    id: "kuban-tur",
    name: "Кубань.Тур",
    shortName: "Кубань.Тур",
    industry: "Туризм",
    city: "Анапа",
    size: "малая",
    about:
      "Молодой региональный туроператор. Маршруты по Кубани, цифровые гиды, агротуризм.",
    values: ["гостеприимство", "локальная культура", "эксперимент"],
    excursionAvailable: true,
    logoColor: "#0EA5A4",
    cover: "/covers/kubantur.svg",
  },
  {
    id: "delovaya",
    name: "Деловая Кубань",
    shortName: "Деловая Кубань",
    industry: "Медиа",
    city: "Краснодар",
    size: "малая",
    about:
      "Региональное деловое СМИ. SMM, видеопродакшен, дата-журналистика.",
    values: ["правда", "скорость", "локальность"],
    excursionAvailable: true,
    logoColor: "#1F2937",
    cover: "/covers/delovaya.svg",
  },
  {
    id: "stroyplus",
    name: "СтройПлюс ЮГ",
    shortName: "СтройПлюс",
    industry: "Строительство",
    city: "Новороссийск",
    size: "средняя",
    about:
      "Инфраструктурное строительство и BIM-проектирование. Открыты к стажёрам по архитектуре и инженерии.",
    values: ["качество", "инженерия", "ответственность"],
    excursionAvailable: true,
    logoColor: "#92400E",
    cover: "/covers/stroyplus.svg",
  },
  {
    id: "edu-kuban",
    name: "ЭдуКубань",
    shortName: "ЭдуКубань",
    industry: "EdTech",
    city: "Краснодар",
    size: "малая",
    about:
      "Стартап в edtech. Курсы и тренажёры для школьников Юга России. Маркетинг, контент, продуктовая аналитика.",
    values: ["миссия", "молодость", "продукт"],
    excursionAvailable: true,
    logoColor: "#7C3AED",
    cover: "/covers/edukuban.svg",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "p-magnit-recsys",
    companyId: "magnit",
    title: "Рекомендательная витрина акций для приложения «Магнит»",
    summary:
      "Спроектировать прототип персональной витрины акций по поведению пользователя.",
    description:
      "Команда из 3 студентов разбирает обезличенный датасет покупок и проектирует прототип витрины: бизнес-логика, фичи, A/B-метрики, дизайн-черновик. На выходе — clickable Figma, презентация бизнесу и mini-research.",
    skills: ["Аналитика данных", "Python", "Продуктовое мышление", "Figma"],
    format: "гибрид",
    city: "Краснодар",
    durationWeeks: 4,
    teamSize: { min: 2, max: 3 },
    stipend: 15000,
    deadline: "2026-06-15",
    status: "open",
    applications: 27,
    capacity: 3,
    difficulty: "intermediate",
    outcome:
      "Опыт работы с реальным датасетом ритейла, защита перед продакт-командой, рекомендательное письмо.",
    mentor: { name: "Полина С.", role: "Lead Product Analyst, Магнит" },
    tags: ["ML-light", "ритейл", "аналитика"],
  },
  {
    id: "p-tander-routing",
    companyId: "tander",
    title: "Мини-исследование: оптимизация маршрутов last-mile",
    summary:
      "Найти точки роста в маршрутах ежедневной доставки одной из площадок.",
    description:
      "Студенты получают синтетические данные по маршрутам, выявляют узкие места, формируют гипотезы и считают потенциальный эффект. Конкретная задача — снизить простой грузовиков на 5–10 %.",
    skills: ["Операционная аналитика", "Excel/Google Sheets", "Геоданные"],
    format: "офлайн",
    city: "Краснодар",
    durationWeeks: 3,
    teamSize: { min: 2, max: 4 },
    stipend: 12000,
    deadline: "2026-06-05",
    status: "open",
    applications: 12,
    capacity: 4,
    difficulty: "beginner",
    outcome:
      "Заводская экскурсия, защита решения перед командой логистики, бейдж «Operations Junior».",
    mentor: { name: "Андрей К.", role: "Head of Routing, Тандер" },
    tags: ["логистика", "операции", "данные"],
  },
  {
    id: "p-yugavto-crm",
    companyId: "yug-avto",
    title: "Сценарии CRM для возврата клиентов после ТО",
    summary:
      "Команда маркетинга студентов проектирует welcome-back-сценарии после техобслуживания.",
    description:
      "Студенты анализируют customer journey клиента после ТО, выдвигают гипотезы по триггерам, верстают письмо/пуш/смс и считают воронку. Дополнительно — короткий A/B-план.",
    skills: ["CRM-маркетинг", "Контент", "Аналитика", "Сегментация"],
    format: "гибрид",
    city: "Краснодар",
    durationWeeks: 4,
    teamSize: { min: 2, max: 3 },
    stipend: 14000,
    deadline: "2026-06-10",
    status: "open",
    applications: 19,
    capacity: 3,
    difficulty: "intermediate",
    outcome:
      "Проектная папка, защита, возможный оффер junior CRM-marketer.",
    mentor: { name: "Дина М.", role: "CRM Lead, Юг-Авто" },
    tags: ["маркетинг", "CRM", "ритейл"],
  },
  {
    id: "p-kubancred-scoring",
    companyId: "kuban-cred",
    title: "Skoring lite: модель риска для МСП за 1 неделю",
    summary:
      "Командное мини-исследование: baseline-модель скоринга малых предприятий.",
    description:
      "Студенты получают учебный датасет и метрики, поэтапно строят baseline (logreg → gbdt), пишут отчёт и презентуют куратору. Сильным студентам — продолжение в полную стажировку.",
    skills: ["Python", "scikit-learn", "Анализ данных", "Отчётность"],
    format: "онлайн",
    city: "Краснодар",
    durationWeeks: 2,
    teamSize: { min: 2, max: 3 },
    stipend: 8000,
    deadline: "2026-05-28",
    status: "open",
    applications: 41,
    capacity: 3,
    difficulty: "intermediate",
    outcome:
      "Реальный кейс резюме, мастер-класс по skoring, потенциальный оффер.",
    mentor: { name: "Игорь В.", role: "Head of Risk, КубаньКредит" },
    tags: ["fintech", "ML", "scoring"],
  },
  {
    id: "p-agro-iot",
    companyId: "agrokomplex",
    title: "Полевой IoT: визуализация показаний датчиков влажности",
    summary:
      "Сделать дашборд для агронома по данным с почвенных датчиков одного поля.",
    description:
      "Команда получает реальные сырые данные с поля и собирает простой дашборд: ETL → Grafana / Streamlit. Сильное направление для будущего AgroTech.",
    skills: ["Python", "Streamlit/Grafana", "Базы данных", "Визуализация"],
    format: "гибрид",
    city: "Выселки",
    durationWeeks: 4,
    teamSize: { min: 2, max: 3 },
    stipend: 16000,
    deadline: "2026-06-20",
    status: "open",
    applications: 9,
    capacity: 3,
    difficulty: "intermediate",
    outcome:
      "Выездной день на полях, портфолио-проект, бейдж «AgroTech Pioneer».",
    mentor: { name: "Сергей Б.", role: "Главный агроном, Агрокомплекс" },
    tags: ["agrotech", "IoT", "data"],
  },
  {
    id: "p-sirius-llm",
    companyId: "sirius-it",
    title: "AI-сайдкик: подсказки для школьников в LMS",
    summary:
      "Прототип помощника на LLM, встроенного в LMS, под надзором ментора.",
    description:
      "Студенты проектируют сценарии помощника (объясни, проверь, повтори), пишут промпты и собирают эксперимент с реальной моделью. Финал — A/B-метрика «помогло / не помогло».",
    skills: ["LLM / GigaChat API", "TypeScript", "Промптинг", "EdTech"],
    format: "онлайн",
    city: "Сочи",
    durationWeeks: 5,
    teamSize: { min: 2, max: 4 },
    stipend: 22000,
    deadline: "2026-07-01",
    status: "open",
    applications: 56,
    capacity: 4,
    difficulty: "advanced",
    outcome:
      "Прототип, статья, оффер на летнюю стажировку Sirius IT.",
    mentor: { name: "Никита Л.", role: "AI Engineer, Sirius IT" },
    tags: ["AI", "edtech", "LLM"],
  },
  {
    id: "p-kubantur-routes",
    companyId: "kuban-tur",
    title: "Молодёжный маршрут «Винные тропы Кубани»",
    summary:
      "Спроектировать выходной-маршрут для студентов и собрать прототип лендинга.",
    description:
      "Студенты собирают концепт маршрута, отбирают объекты, договариваются о посещениях с менторами, делают лендинг и smm-стратегию запуска. Реальный шанс — маршрут пойдёт в продажу.",
    skills: ["Маркетинг", "SMM", "Контент", "Тильда / Webflow"],
    format: "гибрид",
    city: "Анапа",
    durationWeeks: 4,
    teamSize: { min: 3, max: 5 },
    stipend: 10000,
    deadline: "2026-06-30",
    status: "open",
    applications: 18,
    capacity: 5,
    difficulty: "beginner",
    outcome:
      "Маршрут в продаже, упоминание в кейсе компании, бейдж «Region Builder».",
    mentor: { name: "Ольга Р.", role: "Product Lead, Кубань.Тур" },
    tags: ["туризм", "маркетинг", "регион"],
  },
  {
    id: "p-delovaya-dataviz",
    companyId: "delovaya",
    title: "Дата-сторителлинг: «Куда переезжают компании в Кубани»",
    summary:
      "Сделать интерактивное расследование на открытых данных для медиа.",
    description:
      "Команда из 2–3 человек собирает открытые данные (ИНН, Росстат, ЕГРЮЛ), визуализирует переезды компаний и пишет лонгрид. Публикация на сайте СМИ.",
    skills: ["Журналистика", "Python", "Visualisation", "Storytelling"],
    format: "онлайн",
    city: "Краснодар",
    durationWeeks: 3,
    teamSize: { min: 2, max: 3 },
    stipend: 9000,
    deadline: "2026-06-12",
    status: "open",
    applications: 15,
    capacity: 3,
    difficulty: "intermediate",
    outcome:
      "Опубликованный материал в портфолио, бейдж «Data Journalist Jr».",
    mentor: { name: "Мария Ш.", role: "Шеф-редактор, Деловая Кубань" },
    tags: ["media", "data", "журналистика"],
  },
  {
    id: "p-stroyplus-bim",
    companyId: "stroyplus",
    title: "Спринт по BIM: визуализация инженерных сетей жилого дома",
    summary:
      "Команда строит BIM-модель инженерных сетей для типового объекта.",
    description:
      "Студенты архитектурных и инженерных специальностей знакомятся с Revit / BIM-стандартами компании и за 4 недели собирают учебный кейс. Финал — внутренняя защита.",
    skills: ["Revit", "AutoCAD", "BIM", "Инженерия"],
    format: "офлайн",
    city: "Новороссийск",
    durationWeeks: 4,
    teamSize: { min: 2, max: 3 },
    stipend: 18000,
    deadline: "2026-06-25",
    status: "open",
    applications: 7,
    capacity: 3,
    difficulty: "advanced",
    outcome:
      "BIM-кейс для портфолио, рекомендация, потенциальный оффер.",
    mentor: { name: "Антон Г.", role: "BIM-инженер, СтройПлюс" },
    tags: ["BIM", "инженерия", "стройка"],
  },
  {
    id: "p-edukuban-content",
    companyId: "edu-kuban",
    title: "Контент-фабрика TikTok для школьного курса биологии",
    summary:
      "Создать серию из 12 коротких видео по программе 9 класса.",
    description:
      "Команда (сценарист + редактор + 2 ведущих) собирает контент-план, снимает черновики, монтирует и тестирует на фокус-группе школьников. Лучшее идёт в публичный канал.",
    skills: ["Сценарий", "Видеомонтаж", "Биология", "SMM"],
    format: "гибрид",
    city: "Краснодар",
    durationWeeks: 4,
    teamSize: { min: 3, max: 4 },
    stipend: 12000,
    deadline: "2026-06-18",
    status: "open",
    applications: 22,
    capacity: 4,
    difficulty: "beginner",
    outcome:
      "12 опубликованных видео, бейдж «Content Creator», рост подписчиков.",
    mentor: { name: "Лиза К.", role: "Head of Content, ЭдуКубань" },
    tags: ["edtech", "контент", "smm"],
  },
];

export const DEMO_STUDENT: StudentProfile = {
  id: "u-demo",
  fullName: "Артём Кузнецов",
  city: "Краснодар",
  university: "КубГУ",
  year: 3,
  major: "Прикладная информатика",
  skills: ["Python", "SQL", "Аналитика данных", "Figma", "Базовый ML"],
  interests: ["Продуктовая аналитика", "AI", "Ритейл"],
  bio: "Студент 3 курса, ищу первый практический опыт. Интересуюсь данными и продуктовой аналитикой.",
  avatarHue: 156,
  badges: [
    { id: "b-1", label: "Первый AI-чат", emoji: "🤖", date: "2026-05-12" },
    { id: "b-2", label: "Профиль 100 %", emoji: "🎯", date: "2026-05-13" },
    { id: "b-3", label: "AI-матчинг ×5", emoji: "🧭", date: "2026-05-14" },
  ],
  applications: [
    { projectId: "p-magnit-recsys", status: "invited", updatedAt: "2026-05-19" },
    { projectId: "p-kubancred-scoring", status: "new", updatedAt: "2026-05-20" },
  ],
};

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getProjectsByCompany(companyId: string): Project[] {
  return PROJECTS.filter((p) => p.companyId === companyId);
}

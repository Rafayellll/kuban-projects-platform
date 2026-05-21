import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Платформа проектного входа в компании Краснодарского края. Знакомим
            молодёжь с реальной работой через мини-стажировки, экскурсии и
            наставничество. ИИ помогает находить лучшее совпадение.
          </p>
        </div>
        <FooterCol
          title="Молодёжи"
          links={[
            ["/projects", "Каталог проектов"],
            ["/companies", "Компании региона"],
            ["/profile", "Мой профиль"],
          ]}
        />
        <FooterCol
          title="Компаниям"
          links={[
            ["/dashboard", "Кабинет компании"],
            ["/about#companies", "Как разместить кейс"],
            ["/about#analytics", "Аналитика кадрового резерва"],
          ]}
        />
        <FooterCol
          title="Платформа"
          links={[
            ["/about", "О проекте"],
            ["/about#ai", "AI-ядро"],
            ["/about#partners", "Партнёры"],
          ]}
        />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div>© ПроКубань, 2026. MVP-демо для кейса.</div>
          <div className="flex gap-4">
            <span>152-ФЗ: данные хранятся в РФ</span>
            <span>Поддержка региональных программ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="hover:text-brand-700">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

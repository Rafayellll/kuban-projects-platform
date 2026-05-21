"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";

const NAV = [
  { href: "/projects", label: "Проекты" },
  { href: "/companies", label: "Компании" },
  { href: "/profile", label: "Мой профиль" },
  { href: "/dashboard", label: "Кабинет компании" },
  { href: "/about", label: "О платформе" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="ПроКубань — на главную">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={
                  "rounded-full px-3 py-1.5 text-sm font-medium transition " +
                  (active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink/80 hover:bg-ochre-50 hover:text-brand-700")
                }
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/projects"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700 transition"
          >
            Найти проект
          </Link>
        </div>
        <button
          aria-label="Меню"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden rounded-md border border-line p-2 text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="currentColor"
              d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-ochre-50"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className="mt-2 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Найти проект
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

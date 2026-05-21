"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; ts: number };

const SUGGESTIONS = [
  "Подбери мне проект",
  "Не знаю, какую профессию выбрать",
  "Хочу попробовать аналитику данных",
  "Какие компании есть в Краснодаре?",
];

const STORAGE_KEY = "prokuban.chat.v1";

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  // Lazy initializer: read persisted chat from localStorage on first client render.
  // Server render returns []; the assistant panel is hidden by default (open=false),
  // so the initial chat list is not in SSR HTML and there is no hydration mismatch.
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) return parsed as Msg[];
      }
    } catch {
      /* ignore */
    }
    return [];
  });
  const [source, setSource] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [open, messages, pending]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;
      const userMsg: Msg = { role: "user", content: trimmed, ts: Date.now() };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setPending(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map(({ role, content }) => ({ role, content })),
          }),
        });
        const data: { content?: string; source?: string; error?: string } = await res
          .json()
          .catch(() => ({ error: "parse" }));
        if (data.content) {
          setSource(data.source ?? null);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.content!, ts: Date.now() },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Кажется, сервер ИИ занят. Попробуй ещё раз через секунду — или открой раздел «Проекты».",
              ts: Date.now(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Связь с ассистентом прервалась. Проверь интернет и попробуй ещё раз.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending],
  );

  const reset = () => {
    setMessages([]);
    setSource(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        aria-label="AI-ассистент"
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-5 right-5 z-50 group flex items-center gap-3 rounded-full bg-brand-600 px-4 py-3 text-white shadow-soft hover:bg-brand-700 transition"
      >
        <span className="relative grid place-items-center">
          <span className="absolute inline-block h-2 w-2 rounded-full bg-ochre-400 dot-pulse" />
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7v3.3a3.7 3.7 0 0 0 1.6 3l1 .7v3.5a2 2 0 0 0 3.1 1.7L13 19h.6a7 7 0 0 0 6.8-6h.2a1.4 1.4 0 0 0 1.4-1.4V9a7 7 0 0 0-9.9-7Z"
            />
            <circle cx="9.5" cy="11" r="1.2" fill="#0E6E4E" />
            <circle cx="14.5" cy="11" r="1.2" fill="#0E6E4E" />
          </svg>
        </span>
        <span className="text-sm font-semibold pr-1 hidden sm:inline">
          AI-ассистент
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-5 z-50 w-auto sm:w-[400px] max-h-[min(640px,80vh)] rounded-2xl bg-white shadow-2xl border border-line flex flex-col animate-pop">
          <div className="flex items-start justify-between gap-2 p-4 border-b border-line">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-600 text-white">
                  AI
                </span>
                Ассистент ПроКубани
              </div>
              <div className="text-xs text-muted mt-0.5">
                Помогаю выбрать проект, профессию или компанию региона
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                title="Сбросить диалог"
                className="rounded-md p-1.5 text-muted hover:bg-ochre-50"
                aria-label="Очистить диалог"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="rounded-md p-1.5 text-muted hover:bg-ochre-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll">
            {messages.length === 0 && (
              <div>
                <div className="rounded-2xl rounded-tl-sm bg-brand-50 px-3 py-2 text-sm text-brand-800">
                  Привет! Я AI-ассистент ПроКубани. Расскажи о себе или выбери
                  быстрый запрос ниже — подберу проект и направление.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-ochre-50 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}

            {pending && (
              <div className="flex gap-1.5 px-3">
                <span className="h-2 w-2 rounded-full bg-brand-400 dot-pulse" />
                <span className="h-2 w-2 rounded-full bg-brand-400 dot-pulse" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-brand-400 dot-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          <form
            className="border-t border-line p-3 flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Напиши вопрос…"
              className="flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-brand-200 disabled:cursor-not-allowed"
            >
              Отправить
            </button>
          </form>
          <div className="px-3 pb-3 -mt-1 text-[10px] text-muted">
            Демо-режим. Источник:{" "}
            <span className="font-mono">{source ?? "—"}</span>. В проде —
            GigaChat / YandexGPT.
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div
        className={
          "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 " +
          (isUser
            ? "bg-brand-600 text-white rounded-tr-sm"
            : "bg-brand-50 text-brand-900 rounded-tl-sm")
        }
      >
        {renderRich(content)}
      </div>
    </div>
  );
}

/** Минимальный markdown-форматтер для **bold** и переносов. */
function renderRich(text: string): React.ReactNode {
  const lines = text.split(/\n/);
  return lines.map((line, idx) => (
    <span key={idx}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
        chunk.startsWith("**") && chunk.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {chunk.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{chunk}</span>
        ),
      )}
      {idx < lines.length - 1 && <br />}
    </span>
  ));
}

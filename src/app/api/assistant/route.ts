import { NextResponse } from "next/server";
import { chatCompletion, type ChatMessage } from "@/lib/ai";

export const runtime = "nodejs";

type Body = { messages?: ChatMessage[] };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m): m is ChatMessage =>
      !!m &&
      (m.role === "user" || m.role === "assistant" || m.role === "system") &&
      typeof m.content === "string" &&
      m.content.length > 0,
  );

  if (messages.length === 0) {
    return NextResponse.json({ error: "no messages" }, { status: 400 });
  }
  if (messages.length > 30) {
    // обрезаем длинные истории чтобы не отправлять много токенов
    messages.splice(0, messages.length - 30);
  }

  const result = await chatCompletion(messages);
  return NextResponse.json(result);
}

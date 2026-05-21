import { NextResponse } from "next/server";
import { matchProjects } from "@/lib/ai";
import { DEMO_STUDENT, type StudentProfile } from "@/lib/data";

export const runtime = "nodejs";

type Body = { profile?: Partial<StudentProfile>; topN?: number };

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    /* allow empty body */
  }
  const profile: StudentProfile = { ...DEMO_STUDENT, ...body.profile };
  const top = matchProjects(profile, body.topN ?? 5);
  return NextResponse.json({
    profile: { city: profile.city, skills: profile.skills, interests: profile.interests, year: profile.year },
    matches: top.map((m) => ({
      projectId: m.project.id,
      title: m.project.title,
      companyId: m.project.companyId,
      score: m.score,
      reasons: m.reasons,
    })),
  });
}

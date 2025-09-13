import { NextResponse } from "next/server";
import { fetchNaverHtml, parseRanks, attachLogo } from "@/lib/kbo";
import { adaptRankings, type NaverSeasonResponse } from "@/lib/kbo-json";

export const revalidate = 300; // 5분 캐시

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";
    const jsonUrl = searchParams.get("jsonUrl") || process.env.KBO_JSON_URL;

    let rankings: any[] | null = null;

    // JSON API가 있으면 먼저 시도
    if (jsonUrl) {
      const res = await fetch(jsonUrl, force ? { cache: "no-store" } : { next: { revalidate: 300 } });
      if (res.ok) {
        const data = (await res.json()) as NaverSeasonResponse;
        const adapted = adaptRankings(data);
        if (adapted?.length) rankings = adapted;
      }
    }

    // fallback: 네이버 HTML 파싱
    if (!rankings) {
      const html = await fetchNaverHtml(force ? { noStore: true } : { tag: "kbo-team-rankings" });
      rankings = attachLogo(parseRanks(html));
    }

    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString(), rankings });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
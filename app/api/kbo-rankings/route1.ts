import { NextResponse } from "next/server";
import { fetchNaverHtml, parseRanks, attachLogo } from "@/lib/kbo";
import { adaptRankings, type NaverSeasonResponse } from "@/lib/kbo-json";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";
    const jsonUrl = searchParams.get("jsonUrl") || process.env.KBO_JSON_URL;
    let rankings: any[] | null = null;
    if (jsonUrl) {
      const res = await fetch(jsonUrl, force ? { cache: "no-store" } : { next: { revalidate: 300, tags: ["kbo-team-rankings"] } });
      if (res.ok) {
        const data = (await res.json()) as NaverSeasonResponse;
        const adapted = adaptRankings(data);
        if (adapted && adapted.length) rankings = adapted;
      }
    }
    if (!rankings) {
      const html = await fetchNaverHtml(force ? { noStore: true } : { tag: "kbo-team-rankings" });
      rankings = attachLogo(parseRanks(html));
    }
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString(), rankings });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

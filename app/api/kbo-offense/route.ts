import { NextResponse } from "next/server";
import { fetchNaverHtml, parseOffense, attachLogo } from "@/lib/kbo";
import { adaptOffense, type NaverSeasonResponse } from "@/lib/kbo-json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";
    const jsonUrl = searchParams.get("jsonUrl") || process.env.KBO_JSON_URL;
    let offense: any[] | null = null;
    if (jsonUrl) {
      const res = await fetch(jsonUrl, force ? { cache: "no-store" } : { next: { revalidate: 300, tags: ["kbo-team-offense"] } });
      if (res.ok) {
        const data = (await res.json()) as NaverSeasonResponse;
        const adapted = adaptOffense(data);
        if (adapted && adapted.length) offense = adapted;
      }
    }
    if (!offense) {
      const html = await fetchNaverHtml(force ? { noStore: true } : { tag: "kbo-team-offense" });
      offense = attachLogo(parseOffense(html));
    }
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString(), offense });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

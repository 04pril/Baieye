import { NextResponse } from "next/server";
import { fetchNaverHtml, parseDefense, attachLogo } from "@/lib/kbo";
import { adaptDefense, type NaverSeasonResponse } from "@/lib/kbo-json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";
    const jsonUrl = searchParams.get("jsonUrl") || process.env.KBO_JSON_URL;
    let defense: any[] | null = null;
    if (jsonUrl) {
      const res = await fetch(jsonUrl, force ? { cache: "no-store" } : { next: { revalidate: 300, tags: ["kbo-team-defense"] } });
      if (res.ok) {
        const data = (await res.json()) as NaverSeasonResponse;
        const adapted = adaptDefense(data);
        if (adapted && adapted.length) defense = adapted;
      }
    }
    if (!defense) {
      const html = await fetchNaverHtml(force ? { noStore: true } : { tag: "kbo-team-defense" });
      defense = attachLogo(parseDefense(html));
    }
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString(), defense });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

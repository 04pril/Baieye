import { NextResponse } from "next/server";
import { fetchMonthEndRankings } from "@/lib/kbo-month";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("season") || 2025);
    const force = searchParams.get("force") === "1";
    const jsonUrl = process.env.KBO_JSON_URL;
    if (!jsonUrl) return NextResponse.json({ ok: false, error: "KBO_JSON_URL not set" }, { status: 500 });
    const data = await fetchMonthEndRankings(year, jsonUrl, force);
    return NextResponse.json({ ok: true, season: year, ...data, updatedAt: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { adaptTopPlayers, fetchTopPlayers } from "@/lib/kbo-top";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "HITTER").toUpperCase();
    const force = searchParams.get("force") === "1";
    if (type !== "HITTER" && type !== "PITCHER") {
      return NextResponse.json({ ok: false, error: "type must be HITTER or PITCHER" }, { status: 400 });
    }
    const json = await fetchTopPlayers(type as any, { force });
    const categories = adaptTopPlayers(type as any, json);
    return NextResponse.json({ ok: true, type, updatedAt: new Date().toISOString(), categories });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


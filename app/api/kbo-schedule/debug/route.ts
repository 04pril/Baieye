import { NextResponse } from "next/server";
import { fetchKboScheduleHtml } from "@/lib/kbo-schedule";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const html = await fetchKboScheduleHtml(date, { noStore: true });
    return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


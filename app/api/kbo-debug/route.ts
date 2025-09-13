import { NextResponse } from "next/server";
import { fetchNaverHtml } from "@/lib/kbo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const noStore = searchParams.get("noStore") === "1";
    const html = await fetchNaverHtml({ noStore });
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


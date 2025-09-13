import { NextResponse } from "next/server";
import { getKboSchedule, secondsUntilNextKSTMidnight, scheduleTagForDate } from "@/lib/kbo-schedule";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const date = searchParams.get("date") || undefined; // YYYY-MM-DD preferred
    const noStore = searchParams.get("noStore") === "1";
    const debug = searchParams.get("debug") === "1";

    const games = await getKboSchedule(date, { noStore });

    const body: any = { ok: true, date: date || null, revalidateIn: noStore ? 0 : secondsUntilNextKSTMidnight(), tag: scheduleTagForDate(date), games };
    if (debug) {
      body.debug = { count: games?.length ?? 0 };
    }

    return NextResponse.json(
      body,
      {
        status: 200,
        // Helpful cache headers for platforms that support it (e.g., Vercel edge cache)
        headers: noStore
          ? { "Cache-Control": "no-store" }
          : { "Cache-Control": `s-maxage=${secondsUntilNextKSTMidnight()}, stale-while-revalidate=60` },
      },
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

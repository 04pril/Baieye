import { NextResponse } from "next/server";
import { getKboScheduleMonth, secondsUntilNextKSTMidnight } from "@/lib/kbo-schedule";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year") || new Date().getFullYear());
    const month = (searchParams.get("month") || String(new Date().getMonth() + 1).padStart(2, "0")).padStart(2, "0");
    const noStore = searchParams.get("noStore") === "1";

    const games = await getKboScheduleMonth(year, month, { noStore });

    return NextResponse.json(
      { ok: true, year, month, revalidateIn: noStore ? 0 : secondsUntilNextKSTMidnight(), games },
      {
        status: 200,
        headers: noStore
          ? { "Cache-Control": "no-store" }
          : { "Cache-Control": `s-maxage=${secondsUntilNextKSTMidnight()}, stale-while-revalidate=60` },
      },
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


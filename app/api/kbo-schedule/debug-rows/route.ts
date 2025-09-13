import { NextResponse } from "next/server";
import { secondsUntilNextKSTMidnight } from "@/lib/kbo-schedule";

async function fetchRows(year: string, month: string) {
  const url = "https://www.koreabaseball.com/ws/Schedule.asmx/GetScheduleList";
  const body = new URLSearchParams({
    leId: "1",
    srIdList: "0,9,6",
    seasonId: year,
    gameMonth: month,
    teamId: "",
  }).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: "https://www.koreabaseball.com/Schedule/Schedule.aspx",
    },
    next: { revalidate: secondsUntilNextKSTMidnight(), tags: ["kbo-schedule-debug-rows"] },
    body,
  });
  const data = await res.json();
  return data;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || new Date().getFullYear().toString();
    const month = searchParams.get("month") || String(new Date().getMonth() + 1).padStart(2, "0");
    const data = await fetchRows(year, month);
    return NextResponse.json({ ok: true, year, month, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


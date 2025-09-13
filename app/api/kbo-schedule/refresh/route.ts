import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { scheduleTagForDate } from "@/lib/kbo-schedule";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined; // YYYY-MM-DD
    const tag = scheduleTagForDate(date);
    revalidateTag(tag);
    return NextResponse.json({ ok: true, revalidated: true, tag, date: date || null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}


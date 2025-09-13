import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    // Invalidate all related tags so next request re-fetches
    ["kbo-team-rankings", "kbo-team-offense", "kbo-team-defense"].forEach((t) => revalidateTag(t));
    return NextResponse.json({ ok: true, revalidated: true, tags: ["kbo-team-rankings", "kbo-team-offense", "kbo-team-defense"] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

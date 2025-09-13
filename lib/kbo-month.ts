import { adaptRankings, type NaverSeasonResponse } from "./kbo-json";

function fmtDate(date: Date, sep = "-") {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return sep ? `${y}${sep}${m}${sep}${d}` : `${y}${m}${d}`;
}

function lastDayOfMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

export async function fetchMonthEndRankings(year: number, jsonUrl: string, force = false) {
  const months = [4, 5, 6, 7, 8, 9, 10];
  const results: Record<string, { month: string; ranks: { team: string; rank: number }[] }> = {};

  for (const m of months) {
    const last = lastDayOfMonth(year, m);
    const date = new Date(year, m - 1, last);
    const sepA = fmtDate(date, "");
    const sepB = fmtDate(date, "-");
    const candidates = [
      `${jsonUrl}${jsonUrl.includes("?") ? "&" : "?"}date=${sepA}`,
      `${jsonUrl}${jsonUrl.includes("?") ? "&" : "?"}date=${sepB}`,
    ];

    let adapted: { rank: number; team: string }[] | null = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, force ? { cache: "no-store" } : { next: { revalidate: 300, tags: ["kbo-monthly"] } });
        if (!res.ok) continue;
        const data = (await res.json()) as NaverSeasonResponse;
        const ranks = adaptRankings(data);
        if (ranks && ranks.length) {
          adapted = ranks.map((r) => ({ rank: r.rank, team: r.team }));
          break;
        }
      } catch {
        // try next
      }
    }

    // Fallback: use current snapshot without date
    if (!adapted) {
      try {
        const res = await fetch(jsonUrl, force ? { cache: "no-store" } : { next: { revalidate: 300, tags: ["kbo-monthly"] } });
        if (res.ok) {
          const data = (await res.json()) as NaverSeasonResponse;
          const ranks = adaptRankings(data);
          adapted = ranks.map((r) => ({ rank: r.rank, team: r.team }));
        }
      } catch {}
    }

    results[String(m)] = {
      month: `${m}월`,
      ranks: adapted || [],
    };
  }

  // Build per-team series
  const teamSet = new Set<string>();
  for (const m of Object.keys(results)) {
    for (const r of results[m].ranks) teamSet.add(r.team);
  }
  const series = Array.from(teamSet).map((team) => ({
    team,
    data: months.map((m) => {
      const entry = results[String(m)].ranks.find((r) => r.team === team);
      return { month: `${m}월`, rank: entry ? entry.rank : null };
    }),
  }));

  return { months: months.map((m) => `${m}월`), series };
}


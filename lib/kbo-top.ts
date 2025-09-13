export type PlayerType = "HITTER" | "PITCHER";

export const NAVER_TOP_PLAYERS_BASE =
  "https://api-gw.sports.naver.com/statistics/categories/kbo/seasons/2025/top-players";

type NaverTopPlayer = {
  ranking?: number;
  rank?: number;
  playerName?: string;
  teamName?: string;
  teamId?: string;
  teamImageUrl?: string;
  // common batting
  avg?: number; // batting average
  hra?: number; // sometimes used
  hr?: number;
  rbi?: number;
  sb?: number;
  ops?: number;
  obp?: number;
  slg?: number;
  // common pitching
  era?: number;
  w?: number;
  so?: number;
  kk?: number;
  sv?: number;
  whip?: number;
};

export type TopCategories = Record<string, { rank: number; name: string; team: string; value: string | number }[]>;

export async function fetchTopPlayers(type: PlayerType, opts?: { force?: boolean }) {
  const url = `${NAVER_TOP_PLAYERS_BASE}?limit=30&rankFlag=Y&playerType=${type}`;
  const res = await fetch(url, opts?.force ? { cache: "no-store" } : { next: { revalidate: 300, tags: [
    type === "HITTER" ? "kbo-top-hitters" : "kbo-top-pitchers",
  ] } });
  if (!res.ok) throw new Error(`Top players upstream ${res.status}`);
  return (await res.json()) as { result?: { players?: NaverTopPlayer[] } } | any;
}

function val(x: any) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export function adaptTopPlayers(type: PlayerType, json: any): TopCategories {
  const result = json?.result ?? json;

  // Naver current schema: result.topPlayers = [ { type: 'pitcherEra', rankings: [...] }, ... ]
  const topPlayers = Array.isArray(result?.topPlayers) ? result.topPlayers : null;
  if (topPlayers) {
    const out: TopCategories = {};
    const mapTypeToCategory: Record<string, { key: string; valueField: string; digits?: number; asc?: boolean }> = {
      // Pitcher
      pitcherEra: { key: "era", valueField: "pitcherEra", digits: 2, asc: true },
      pitcherWin: { key: "wins", valueField: "pitcherWin" },
      pitcherKk: { key: "strikeouts", valueField: "pitcherKk" },
      pitcherSave: { key: "saves", valueField: "pitcherSave" },
      pitcherWhip: { key: "whip", valueField: "pitcherWhip", digits: 2, asc: true },
      pitcherWar: { key: "war", valueField: "pitcherWar" },
      // Hitter
      hitterHra: { key: "average", valueField: "hitterHra", digits: 3 },
      hitterHr: { key: "homeruns", valueField: "hitterHr" },
      hitterRbi: { key: "rbis", valueField: "hitterRbi" },
      hitterSb: { key: "steals", valueField: "hitterSb" },
      hitterOps: { key: "ops", valueField: "hitterOps", digits: 3 },
      hitterWar: { key: "war", valueField: "hitterWar" },
    };

    for (const group of topPlayers) {
      const conf = mapTypeToCategory[group?.type as string];
      if (!conf || !Array.isArray(group?.rankings)) continue;
      const arr = group.rankings
        .map((p: any, i: number) => ({
          rank: i + 1,
          name: String(p.playerName || ""),
          team: String(p.teamName || p.teamShortName || p.teamId || ""),
          value: p[conf.valueField],
        }))
        .filter((x: any) => x.name);
      if (!arr.length) continue;
      // Sort according to metric (ERA/WHIP ascending, others descending), just in case
      arr.sort((a: any, b: any) => {
        const av = Number(a.value), bv = Number(b.value);
        if (!Number.isFinite(av) || !Number.isFinite(bv)) return 0;
        return conf.asc ? av - bv : bv - av;
      });
      const formatted = arr.slice(0, 20).map((r: any, i: number) => ({
        ...r,
        rank: i + 1,
        value:
          typeof r.value === "number" && conf.digits != null
            ? (conf.digits === 3 ? r.value.toFixed(3) : r.value.toFixed(2))
            : r.value,
      }));
      out[conf.key] = formatted;
    }

    return out;
  }

  // Fallbacks for other potential schemas (keep previous flexibility)
  const players: NaverTopPlayer[] =
    result?.players || result?.items || result?.list || json?.players || [];
  const rows = players
    .map((p) => ({
      rank: val(p.ranking ?? p.rank),
      name: String(p.playerName || ""),
      team: String(p.teamName || p.teamId || ""),
      avg: val((p as any).avg ?? (p as any).hra ?? (p as any).hitterHra),
      hr: val((p as any).hr ?? (p as any).hitterHr),
      rbi: val((p as any).rbi ?? (p as any).hitterRbi),
      sb: val((p as any).sb ?? (p as any).hitterSb),
      ops: val((p as any).ops ?? (p as any).hitterOps ?? ((p as any).obp || 0) + ((p as any).slg || 0)),
      war: val((p as any).war ?? (p as any).hitterWar ?? (p as any).pitcherWar),
      era: val((p as any).era ?? (p as any).pitcherEra),
      w: val((p as any).w ?? (p as any).pitcherWin),
      so: val((p as any).so ?? (p as any).kk ?? (p as any).pitcherKk),
      sv: val((p as any).sv ?? (p as any).pitcherSave),
      whip: val((p as any).whip ?? (p as any).pitcherWhip),
    }))
    .filter((r) => r.name);

  const top = (key: keyof (typeof rows)[number], digits?: number, asc?: boolean) =>
    rows
      .filter((r) => Number.isFinite(r[key] as any))
      .sort((a: any, b: any) => (asc ? a[key] - b[key] : b[key] - a[key]))
      .slice(0, 20)
      .map((r, i) => ({
        rank: i + 1,
        name: r.name,
        team: r.team,
        value: digits != null ? Number(r[key]).toFixed(digits) : r[key],
      }));

  return (
    type === "HITTER"
      ? {
          average: top("avg", 3),
          homeruns: top("hr"),
          rbis: top("rbi"),
          steals: top("sb"),
          ops: top("ops", 3),
          war: top("war"),
        }
      : {
          era: top("era", 2, true),
          wins: top("w"),
          strikeouts: top("so"),
          saves: top("sv"),
          whip: top("whip", 2, true),
          war: top("war"),
        }
  ) as TopCategories;
}

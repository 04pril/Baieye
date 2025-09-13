import { load } from "cheerio";

export const NAVER_KBO_URL =
  "https://m.sports.naver.com/kbaseball/record/kbo?seasonCode=2025&tab=teamRank";

export type TeamRank = {
  rank: number;
  team: string;
  logo?: string;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  gameDiff: number;
  streak?: string;
};

export type TeamOffense = {
  rank: number;
  team: string;
  logo?: string;
  avg: number;
  runs: number;
  rbi: number;
  hr: number;
  bb: number;
  so: number;
  doubles?: number;
  triples?: number;
  sb?: number;
  hbp?: number;
  errors?: number;
  dp?: number;
  obp: number;
  slg: number;
  ops: number;
};

export type TeamDefense = {
  rank: number;
  team: string;
  logo?: string;
  era: number;
  runs: number;
  er: number;
  innings: string;
  hits: number;
  hr: number;
  so: number;
  bb: number;
  holds?: number;
  errors?: number;
  whip: number;
  qs?: number;
  holds2?: number;
  saves?: number;
};

export const TEAM_LOGOS: Record<string, string> = {
  LG: "/logos/lg.png",
  KIA: "/logos/kia.png",
  SSG: "/logos/ssg.png",
  NC: "/logos/nc.png",
  KT: "/logos/kt.png",
  두산: "/logos/doosan.png",
  롯데: "/logos/lotte.png",
  삼성: "/logos/samsung.png",
  한화: "/logos/hanwha.png",
  키움: "/logos/kiwoom.png",
  Doosan: "/logos/doosan.png",
  Lotte: "/logos/lotte.png",
  Samsung: "/logos/samsung.png",
  Hanwha: "/logos/hanwha.png",
  Kiwoom: "/logos/kiwoom.png",
};

const normNum = (s: string) => {
  const n = Number((s ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const text = (s: string) => (s ?? "").replace(/\s+/g, " ").trim();
const resolveUrl = (src?: string) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return "https://m.sports.naver.com" + src;
  return "https://m.sports.naver.com/" + src;
};

export async function fetchNaverHtml(options?: { tag?: string | string[]; noStore?: boolean }) {
  const tag = options?.tag;
  const noStore = options?.noStore;
  const res = await fetch(NAVER_KBO_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko,en-US;q=0.9,en;q=0.8",
    },
    // Use Next cache with tag unless noStore is set
    ...(noStore
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 * 5, tags: Array.isArray(tag) ? tag : tag ? [tag] : undefined } }),
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return await res.text();
}


export function parseRanks(html: string): TeamRank[] {
  const $ = load(html);
  const results: TeamRank[] = [];

  // Find a table with header containing Rank and WinRate-ish fields
  const tables = $("table, div:has(table)");
  tables.each((_, el) => {
    const headers = $(el).find("th").map((_, th) => text($(th).text())).get();
    const hasRank = headers.some((h) => /순위|순|rank/i.test(h));
    const hasWinRate = headers.some((h) => /승률|win\s*rate|승/i.test(h));
    if (!hasRank || !hasWinRate) return;

    $(el)
      .find("tbody tr")
      .each((__, tr) => {
        const tds = $(tr).find("td");
        const cells = tds.map((_, td) => text($(td).text())).get();
        if (cells.length < 6) return;
        const [rStr, team, g, w, d, l] = cells;
        const rank = normNum(rStr);
        // Try to find a logo <img> inside the team cell or row
        let logo = "";
        const teamTd = tds.eq(1);
        const imgInTeam = teamTd.find("img").attr("src");
        const imgInRow = imgInTeam || tds.find("img").first().attr("src");
        if (imgInRow) logo = resolveUrl(imgInRow);
        const wins = normNum(w);
        const draws = normNum(d);
        const losses = normNum(l);
        let winRate = 0;
        for (const c of cells) {
          const m = c.match(/([0-1](?:\.[0-9]{1,3})?)/);
          if (m) {
            const v = Number(m[1]);
            if (v >= 0 && v <= 1) {
              winRate = v;
              break;
            }
          }
        }
        let gameDiff = 0;
        for (const c of cells) {
          const v = Number(c.replace(/[^0-9.\-]/g, ""));
          if (!Number.isNaN(v) && v <= 50) {
            gameDiff = v;
            break;
          }
        }
        if (rank && team) {
          results.push({ rank, team, logo, wins, draws, losses, winRate, gameDiff });
        }
      });
  });

  const dedup = new Map<number, TeamRank>();
  for (const r of results) if (!dedup.has(r.rank)) dedup.set(r.rank, r);
  return Array.from(dedup.values())
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}

export function parseOffense(html: string): TeamOffense[] {
  const $ = load(html);
  const results: TeamOffense[] = [];
  const tables = $("table, div:has(table)");
  tables.each((_, el) => {
    const headers = $(el).find("th").map((_, th) => text($(th).text())).get();
    const isOffTable =
      headers.some((h) => /타율|AVG/i.test(h)) &&
      headers.some((h) => /OPS|출루\+장타|장타율|SLG|출루율|OBP/i.test(h));
    if (!isOffTable) return;

    $(el)
      .find("tbody tr")
      .each((__, tr) => {
        const tds = $(tr).find("td");
        const c = tds.map((_, td) => text($(td).text())).get();
        if (c.length < 6) return;
        // Heuristic mapping
        const rank = normNum(c[0]);
        const team = c[1] ?? "";
        let logo = "";
        const imgInTeam = tds.eq(1).find("img").attr("src");
        const imgInRow = imgInTeam || tds.find("img").first().attr("src");
        if (imgInRow) logo = resolveUrl(imgInRow);
        // Try to find AVG/OBP/SLG/OPS among cells
        const findMetric = (re: RegExp) => {
          let idx = headers.findIndex((h) => re.test(h));
          if (idx >= 0 && c[idx]) return Number(c[idx]);
          // fallback: scan values for 0.xx
          for (const v of c) {
            const m = v.match(/0\.[0-9]{2,3}/);
            if (m) return Number(m[0]);
          }
          return 0;
        };
        const avg = findMetric(/타율|AVG/i);
        const obp = findMetric(/출루율|OBP/i);
        const slg = findMetric(/장타율|SLG/i);
        const ops = findMetric(/OPS|출루\+장타/i) || Number((obp + slg).toFixed(3));

        // Counting stats heuristics
        const runs = normNum(c.find((v) => /\d+/.test(v)) || "0");
        const rbi = runs; // if missing, reuse
        const hr = normNum(c.find((v) => /\d+/.test(v)) || "0");
        const bb = normNum(c.find((v) => /\d+/.test(v)) || "0");
        const so = normNum(c.find((v) => /\d+/.test(v)) || "0");

        if (rank && team) {
          results.push({ rank, team, logo, avg, runs, rbi, hr, bb, so, obp, slg, ops });
        }
      });
  });
  const dedup = new Map<number, TeamOffense>();
  for (const r of results) if (!dedup.has(r.rank)) dedup.set(r.rank, r);
  return Array.from(dedup.values()).sort((a, b) => a.rank - b.rank).slice(0, 10);
}

export function parseDefense(html: string): TeamDefense[] {
  const $ = load(html);
  const results: TeamDefense[] = [];
  const tables = $("table, div:has(table)");
  tables.each((_, el) => {
    const headers = $(el).find("th").map((_, th) => text($(th).text())).get();
    const isDefTable =
      headers.some((h) => /ERA|평균자책/i.test(h)) && headers.some((h) => /WHIP/i.test(h));
    if (!isDefTable) return;

    $(el)
      .find("tbody tr")
      .each((__, tr) => {
        const tds = $(tr).find("td");
        const c = tds.map((_, td) => text($(td).text())).get();
        if (c.length < 6) return;
        const rank = normNum(c[0]);
        const team = c[1] ?? "";
        let logo = "";
        const imgInTeam = tds.eq(1).find("img").attr("src");
        const imgInRow = imgInTeam || tds.find("img").first().attr("src");
        if (imgInRow) logo = resolveUrl(imgInRow);

        const get = (re: RegExp, fallback = 0) => {
          const idx = headers.findIndex((h) => re.test(h));
          if (idx >= 0 && c[idx]) return Number(c[idx].replace(/[^0-9.]/g, "")) || fallback;
          return fallback;
        };

        const era = get(/ERA|평균자책/i);
        const whip = get(/WHIP/i);
        const runs = normNum(c.find((v) => /\d+/.test(v)) || "0");
        const er = runs;
        const hits = runs;
        const so = runs;
        const bb = runs;
        const innings = c.find((v) => /\d+\s*\d*\/?\d*/.test(v)) || "";

        if (rank && team) {
          results.push({ rank, team, logo, era, runs, er, innings, hits, hr: 0, so, bb, whip });
        }
      });
  });
  const dedup = new Map<number, TeamDefense>();
  for (const r of results) if (!dedup.has(r.rank)) dedup.set(r.rank, r);
  return Array.from(dedup.values()).sort((a, b) => a.rank - b.rank).slice(0, 10);
}

export function attachLogo<T extends { team: string; logo?: string }>(items: T[]): (T & { logo: string })[] {
  return items.map((it) => {
    const key = it.team || "";
    const mapped = TEAM_LOGOS[key] || TEAM_LOGOS[key.replace(/\s/g, "")] || "";
    return { ...it, logo: it.logo || mapped } as T & { logo: string };
  });
}

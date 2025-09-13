import { load } from "cheerio";

export type KBOScheduleGame = {
  time?: string;
  homeTeam: string;
  awayTeam: string;
  stadium?: string;
  broadcasts?: string[];
  previewUrl?: string;
  status?: string; // 예정 | 경기중 | 종료 | 취소 등
  homeScore?: number;
  awayScore?: number;
  date?: string; // YYYY-MM-DD when used in monthly results
};

function fmtDateKST(date: Date) {
  // Convert to KST (UTC+9) safely without mutating input
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600 * 1000);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const d = String(kst.getDate()).padStart(2, "0");
  return { y, m, d, ymd: `${y}-${m}-${d}`, ymdCompact: `${y}${m}${d}` };
}

export function secondsUntilNextKSTMidnight(now = new Date()) {
  // Compute seconds until next midnight in KST
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstNow = new Date(utcMs + 9 * 3600 * 1000);
  const nextMidnightKST = new Date(kstNow);
  nextMidnightKST.setHours(24, 0, 0, 0);
  const diffMs = nextMidnightKST.getTime() - kstNow.getTime();
  return Math.max(60, Math.floor(diffMs / 1000)); // at least 60s
}

export function kboScheduleUrl(date?: string) {
  // KBO official schedule page; keeps defaulting to current day if date missing.
  // When date is provided, try common patterns used on the site.
  // We'll prefer YYYY-MM-DD, and also attempt YYYYMMDD upstream in the fetch.
  const base = "https://www.koreabaseball.com/Schedule/Schedule.aspx";
  if (!date) return base;
  // Main attempt
  return `${base}?date=${encodeURIComponent(date)}`;
}

export async function fetchKboScheduleHtml(date?: string, options?: { noStore?: boolean }) {
  const { ymd, ymdCompact } = fmtDateKST(new Date());
  const candidates: string[] = [];

  if (date) {
    candidates.push(kboScheduleUrl(date));
    // Try compact form too
    const compact = date.replace(/-/g, "");
    candidates.push(kboScheduleUrl(compact));
  } else {
    // No date provided: try explicit today in common formats first
    candidates.push(kboScheduleUrl(ymd));
    candidates.push(kboScheduleUrl(ymdCompact));
    // Finally, the bare page
    candidates.push(kboScheduleUrl());
  }

  let lastErr: any = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ko,en-US;q=0.9,en;q=0.8",
        },
        ...(options?.noStore
          ? { cache: "no-store" as const }
          : { next: { revalidate: secondsUntilNextKSTMidnight(), tags: [scheduleTagForDate(date)] } }),
      });
      if (!res.ok) {
        lastErr = new Error(`KBO upstream ${res.status}`);
        continue;
      }
      return await res.text();
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("fetch failed");
}

// Server JSON used by the site to populate the table
async function fetchKboScheduleListJson(params: { year: string; month: string; srIdList?: string; teamId?: string }, options?: { noStore?: boolean }) {
  const url = "https://www.koreabaseball.com/ws/Schedule.asmx/GetScheduleList";
  const body = new URLSearchParams({
    leId: "1",
    srIdList: params.srIdList || "0,9,6",
    seasonId: params.year,
    gameMonth: params.month,
    teamId: params.teamId || "",
  }).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: "https://www.koreabaseball.com/Schedule/Schedule.aspx",
    },
    ...(options?.noStore ? { cache: "no-store" as const } : { next: { revalidate: secondsUntilNextKSTMidnight(), tags: [scheduleTagForDate(formatKstToday().ymd)] } }),
    body,
  });
  if (!res.ok) throw new Error(`KBO list upstream ${res.status}`);
  // Some ASP.NET ASMX services return text even when JSON-like. Fall back to parsing text.
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as { rows?: any[] };
  } else {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      // Attempt to extract JSON after possible XSSI or d wrapper
      const m = text.match(/\{[\s\S]*\}$/);
      if (m) {
        try { return JSON.parse(m[0]); } catch {}
      }
      throw new Error("Invalid JSON from KBO list");
    }
  }
}

function formatKstToday() {
  return fmtDateKST(new Date());
}

function textIncludesAny(s: string, patterns: string[]) {
  return patterns.some((p) => (p ? s.includes(p) : false));
}

const stripTags = (s: string) => (s ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, " ");

function normalizeRowValues(row: any): string[] {
  const out: string[] = [];
  if (!row || typeof row !== "object") return out;
  // Prefer structured cells array: row.row = [{ Text, Class, ... }, ...]
  if (Array.isArray(row.row)) {
    for (const cell of row.row) {
      const t = typeof cell?.Text === "string" ? stripTags(cell.Text) : "";
      if (t) out.push(t);
    }
  }
  // Fallback to flatten any string/number fields
  for (const k of Object.keys(row)) {
    if (k === "row") continue;
    const v = row[k];
    if (v == null) continue;
    if (typeof v === "string") out.push(stripTags(v));
    else if (typeof v === "number") out.push(String(v));
  }
  return out.map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function adaptScheduleRowsToGames(rows: any[], targetYmd: { y: number; m: string; d: string }) {
  const games: KBOScheduleGame[] = [];
  const mPad = String(Number(targetYmd.m)).padStart(2, "0");
  const dPad = String(Number(targetYmd.d)).padStart(2, "0");
  const targetYmdDash = `${targetYmd.y}-${mPad}-${dPad}`;
  const targetDayPrefixA = `${mPad}.${dPad}`; // 09.12(
  const targetDayPrefixB = `${Number(targetYmd.m)}.${Number(targetYmd.d)}`; // 9.12(
  let currentDateYmd: string | null = null;
  let currentDayRaw: string | null = null; // e.g., "09.12(금)"

  for (const row of rows || []) {
    const cells = Array.isArray(row?.row) ? row.row : [];

    // Update current date if a 'day' cell exists, e.g. "09.12(금)"
    const dayCell = cells.find((c: any) => c?.Class === "day" || /\d{1,2}[./]\d{1,2}\(/.test(String(c?.Text || "")));
    if (dayCell && typeof dayCell.Text === "string") {
      const t = stripTags(dayCell.Text).trim();
      currentDayRaw = t;
      const dm = t.match(/(\d{1,2})[./](\d{1,2})/);
      if (dm) {
        const mm = String(Number(dm[1])).padStart(2, "0");
        const dd = String(Number(dm[2])).padStart(2, "0");
        currentDateYmd = `${targetYmd.y}-${mm}-${dd}`;
      }
    }

    // Decide if this row belongs to target date
    const vals = normalizeRowValues(row);
    const rowText = vals.join(" ");
    const explicitHasDate = new RegExp(`${targetYmd.y}[-./]${Number(targetYmd.m)}[-./]${Number(targetYmd.d)}`).test(rowText) || new RegExp(`${mPad}[./]${dPad}`).test(rowText) || new RegExp(`${targetYmd.y}${mPad}${dPad}`).test(rowText);
    // Also match by the visible day label prefix (e.g., '09.12(' or '9.12(') if available
    const byDayLabel = currentDayRaw ? (currentDayRaw.startsWith(targetDayPrefixA) || currentDayRaw.startsWith(targetDayPrefixB)) : false;
    const belongs = explicitHasDate || currentDateYmd === targetYmdDash || byDayLabel;
    if (!belongs) continue;

    // Parse fields from cells/vals
    let time: string | undefined;
    let stadium: string | undefined;
    let status: string | undefined;
    let broadcasts: string[] | undefined;
    let homeTeam: string | undefined;
    let awayTeam: string | undefined;
    let homeScore: number | undefined;
    let awayScore: number | undefined;

    // Time cell by class or regex
    const timeCell = cells.find((c: any) => c?.Class === "time")?.Text as string | undefined;
    const timeText = stripTags(timeCell || "");
    const timeMatch = timeText.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);
    if (timeMatch) time = timeMatch[0];

    // Play cell: teams and optional scores
    const playCell = cells.find((c: any) => c?.Class === "play")?.Text as string | undefined;
    const playText = stripTags(playCell || rowText);
    // First try to match like "롯데 2 vs 3 LG" or "키움 vs 삼성"
    let vs = playText.match(/([A-Za-z가-힣]+)\s*(\d+)?\s*vs\s*(\d+)?\s*([A-Za-z가-힣]+)/i);
    if (!vs) vs = playText.match(/([A-Za-z가-힣]+)\s*(\d+)?\s*VS\s*(\d+)?\s*([A-Za-z가-힣]+)/i);
    if (vs) {
      // KBO 표기는 보통 "원정 vs 홈" 순서
      awayTeam = vs[1];
      homeTeam = vs[4];
      if (vs[2]) awayScore = normNum(vs[2]);
      if (vs[3]) homeScore = normNum(vs[3]);
    }

    // Stadium, Status, Broadcasts
    for (const s of vals) {
      if (!stadium && /구장|잠실|고척|문학|사직|수원|창원|대전|광주|대구|울산|춘천|원주|포항|경기장/.test(s)) stadium = s;
      if (!status && /예정|경기중|종료|취소|우천/.test(s)) status = s;
      if (!broadcasts && /[A-Z]{2,}-[A-Z0-9]+/.test(s)) broadcasts = s.split(/\s+/).filter((t) => /[A-Z]{2,}-[A-Z0-9]+/.test(t));
    }

    if (!homeTeam || !awayTeam) continue;
    games.push({ time, stadium, status, broadcasts, homeTeam, awayTeam, homeScore, awayScore });
  }
  return games;
}

const normText = (s: string) => (s ?? "").replace(/\s+/g, " ").trim();
const normNum = (s?: string) => {
  const n = Number((s ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
};

export function parseKboSchedule(html: string): KBOScheduleGame[] {
  const $ = load(html);
  const games: KBOScheduleGame[] = [];

  // Try to locate the daily schedule table used on the official site.
  // The structure may vary; we’ll be defensive and look for rows containing VS and a time.
  // Common patterns: a table with thead headers including 시간/경기/중계/구장/비고 등.
  const candidateTables = $("table").filter((_, el) => {
    const headers = $(el).find("th").map((__, th) => normText($(th).text())).get();
    const hasTime = headers.some((h) => /시간|시각|Time/i.test(h));
    const hasGame = headers.some((h) => /경기|매치|Match/i.test(h));
    const hasStadium = headers.some((h) => /구장|경기장|Stadium/i.test(h));
    return hasGame || (hasTime && hasStadium);
  });

  const tables = candidateTables.length ? candidateTables : $("table");
  const TEAM_TOKENS = [
    "LG",
    "KIA",
    "SSG",
    "NC",
    "KT",
    "두산",
    "롯데",
    "삼성",
    "한화",
    "키움",
    "Doosan",
    "Lotte",
    "Samsung",
    "Hanwha",
    "Kiwoom",
  ];

  tables.each((_, table) => {
    $(table)
      .find("tbody tr")
      .each((__, tr) => {
        const tds = $(tr).find("td");
        if (!tds.length) return;

        const cells = tds.map((___, td) => normText($(td).text())).get();
        const rowText = cells.join(" ");

        let time: string | undefined;
        let stadium: string | undefined;
        let broadcasts: string[] | undefined;
        let status: string | undefined;
        let homeTeam: string | undefined;
        let awayTeam: string | undefined;

        // Preferred: KBO schedule columns (시간 | 경기 | 중계 | 구장 | 비고 ...)
        if (cells.length >= 3) {
          // time likely in first cell
          const c0 = cells[0];
          const c1 = cells[1]; // 경기 (e.g., NCvsLG 프리뷰)
          const c2 = cells[2]; // 중계
          const c3 = cells[3]; // 구장 (if exists)
          time = c0 && c0.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/)?.[0] || time;

          // extract VS from 경기 cell first
          if (c1) {
            const vs1 = c1.match(/([A-Za-z가-힣]+)\s*vs\s*([A-Za-z가-힣]+)/i) || c1.match(/([A-Za-z가-힣]+)\s*VS\s*([A-Za-z가-힣]+)/i);
            if (vs1) {
              homeTeam = normText(vs1[1]);
              awayTeam = normText(vs1[2]);
            }
          }

          // broadcasts from c2 if looks like channels
          if (!broadcasts && c2 && /[A-Z]{2,}-[A-Z]/.test(c2)) broadcasts = c2.split(/\s+/).filter((t) => /[A-Z]{2,}-[A-Z]/.test(t));
          if (!stadium && c3 && /구장|잠실|고척|문학|사직|수원|창원|대전|광주|대구|울산|춘천|원주|포항|경기장/.test(c3)) stadium = c3;
        }

        // Fallback: search entire row text
        if (!homeTeam || !awayTeam) {
          const vsMatch = rowText.match(/([A-Za-z가-힣]+)\s*vs\s*([A-Za-z가-힣]+)/i) || rowText.match(/([A-Za-z가-힣]+)\s*VS\s*([A-Za-z가-힣]+)/i);
          if (vsMatch) {
            homeTeam = normText(vsMatch[1]);
            awayTeam = normText(vsMatch[2]);
          }
        }

        // Fallback 2: detect by team tokens appearing in order
        if (!homeTeam || !awayTeam) {
          const found: string[] = [];
          for (const token of TEAM_TOKENS) {
            const re = new RegExp(`(^|\s)${token}(\s|$)`);
            if (re.test(rowText)) {
              if (!found.includes(token)) found.push(token);
            }
          }
          if (found.length >= 2) {
            homeTeam = homeTeam || found[0];
            awayTeam = awayTeam || found[1];
          }
        }

        // status keywords somewhere in row
        for (const c of cells) {
          if (!status && /예정|경기중|종료|취소|우천|콜드/i.test(c)) status = c;
          if (!time && /\b([01]?\d|2[0-3]):[0-5]\d\b/.test(c)) time = c.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/)?.[0];
          if (!stadium && /구장|잠실|고척|문학|사직|수원|창원|대전|광주|대구|울산|춘천|원주|포항|경기장/.test(c)) stadium = c;
          if (!broadcasts && /[A-Z]{2,}-[A-Z0-9]+/.test(c)) broadcasts = c.split(/\s+/).filter((t) => /[A-Z]{2,}-[A-Z0-9]+/.test(t));
        }

        if (!homeTeam || !awayTeam) return;

        // If score is embedded like "A 3 : 2 B" (left=원정, right=홈)
        const scoreMatch = rowText.match(/(\d+)\s*[:|-]\s*(\d+)/);
        const awayScore = normNum(scoreMatch?.[1]);
        const homeScore = normNum(scoreMatch?.[2]);

        games.push({ time, stadium, broadcasts, status, homeTeam, awayTeam, homeScore, awayScore });
      });
  });

  // If nothing parsed, return empty array
  return games;
}

export function scheduleTagForDate(date?: string) {
  const d = date || fmtDateKST(new Date()).ymd;
  return `kbo-schedule-${d}`;
}

export async function getKboSchedule(date?: string, options?: { noStore?: boolean }) {
  // Prefer JSON service used by the site (populates the table) to avoid client-side rendering gap
  try {
    const { y, m, d } = date ? ((): { y: number; m: string; d: string } => {
      // accept YYYY-MM-DD or YYYYMMDD
      const s = date.includes("-") ? date : `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
      const [yy, mm, dd] = s.split("-");
      return { y: Number(yy), m: mm, d: dd };
    })() : ((): { y: number; m: string; d: string } => {
      const { y, m, d } = formatKstToday();
      return { y, m, d } as any;
    })();

    const json = await fetchKboScheduleListJson({ year: String(y), month: m }, options);
    // JSON shape can be { rows: [...] } or { data: { rows: [...] } }
    const rows = Array.isArray((json as any)?.rows) ? (json as any).rows : Array.isArray((json as any)?.data?.rows) ? (json as any).data.rows : [];
    const games = adaptScheduleRowsToGames(rows, { y, m, d });
    if (games.length) return games;
  } catch {
    // ignore and fallback
  }

  // Fallback to HTML parsing (may be empty because rows are injected client-side)
  try {
    const html = await fetchKboScheduleHtml(date, options);
    const parsed = parseKboSchedule(html);
    return parsed;
  } catch {
    return [];
  }
}

// Adapt entire month rows into per-game entries with explicit date
export function adaptScheduleRowsToMonthlyGames(rows: any[], year: number): KBOScheduleGame[] {
  const games: KBOScheduleGame[] = [];
  let currentDateYmd: string | null = null;

  for (const row of rows || []) {
    const cells = Array.isArray(row?.row) ? row.row : [];

    const dayCell = cells.find((c: any) => c?.Class === "day" || /\d{1,2}[./]\d{1,2}\(/.test(String(c?.Text || "")));
    if (dayCell && typeof dayCell.Text === "string") {
      const t = stripTags(dayCell.Text).trim();
      const dm = t.match(/(\d{1,2})[./](\d{1,2})/);
      if (dm) {
        const mm = String(Number(dm[1])).padStart(2, "0");
        const dd = String(Number(dm[2])).padStart(2, "0");
        currentDateYmd = `${year}-${mm}-${dd}`;
      }
    }

    // Skip rows without a resolved date
    if (!currentDateYmd) continue;

    // Extract columns
    const vals = normalizeRowValues(row);
    const rowText = vals.join(" ");

    let time: string | undefined;
    let stadium: string | undefined;
    let status: string | undefined;
    let broadcasts: string[] | undefined;
    let homeTeam: string | undefined;
    let awayTeam: string | undefined;
    let homeScore: number | undefined;
    let awayScore: number | undefined;

    const timeCell = cells.find((c: any) => c?.Class === "time")?.Text as string | undefined;
    const timeText = stripTags(timeCell || "");
    const timeMatch = timeText.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);
    if (timeMatch) time = timeMatch[0];

    const playCell = cells.find((c: any) => c?.Class === "play")?.Text as string | undefined;
    const playText = stripTags(playCell || rowText);
    let vs = playText.match(/([A-Za-z가-힣]+)\s*(\d+)?\s*vs\s*(\d+)?\s*([A-Za-z가-힣]+)/i) || playText.match(/([A-Za-z가-힣]+)\s*(\d+)?\s*VS\s*(\d+)?\s*([A-Za-z가-힣]+)/i);
    if (vs) {
      homeTeam = vs[1];
      awayTeam = vs[4];
      if (vs[2]) homeScore = normNum(vs[2]);
      if (vs[3]) awayScore = normNum(vs[3]);
    }

    for (const s of vals) {
      if (!stadium && /구장|잠실|고척|문학|사직|수원|창원|대전|광주|대구|울산|춘천|원주|포항|경기장/.test(s)) stadium = s;
      if (!status && /예정|경기중|종료|취소|우천/.test(s)) status = s;
      if (!broadcasts && /[A-Z]{2,}-[A-Z0-9]+/.test(s)) broadcasts = s.split(/\s+/).filter((t) => /[A-Z]{2,}-[A-Z0-9]+/.test(t));
    }

    if (!homeTeam || !awayTeam) continue;
    games.push({ date: currentDateYmd, time, stadium, status, broadcasts, homeTeam, awayTeam, homeScore, awayScore });
  }
  return games;
}

export async function getKboScheduleMonth(year: number, month: string, options?: { noStore?: boolean }) {
  const json = await fetchKboScheduleListJson({ year: String(year), month }, options);
  const rows = Array.isArray((json as any)?.rows) ? (json as any).rows : Array.isArray((json as any)?.data?.rows) ? (json as any).data.rows : [];
  return adaptScheduleRowsToMonthlyGames(rows, year);
}

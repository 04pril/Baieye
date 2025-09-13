export type NaverSeasonTeam = {
  teamId: string;
  teamName: string;
  teamImageUrl?: string;
  ranking: number;
  wra: number; // win rate
  gameBehind: number;
  gameCount: number;
  winGameCount: number;
  drawnGameCount: number;
  loseGameCount: number;
  continuousGameResult?: string;

  // offense
  offenseHra?: number;
  offenseRun?: number;
  offenseRbi?: number;
  offenseHr?: number;
  offenseH2?: number;
  offenseH3?: number;
  offenseSb?: number;
  offenseBbhp?: number; // BB + HBP (site-specific)
  offenseKk?: number;
  offenseGd?: number; // GIDP
  offenseObp?: number;
  offenseSlg?: number;
  offenseOps?: number;

  // defense
  defenseEra?: number;
  defenseR?: number;
  defenseEr?: number;
  defenseInning?: number; // as number like 1156.1
  defenseHit?: number;
  defenseHr?: number;
  defenseKk?: number;
  defenseBbhp?: number; // BB + HBP
  defenseErr?: number;
  defenseWhip?: number;
  defenseQs?: number;
  defenseSave?: number;
  defenseHold?: number;
};

export type NaverSeasonResponse = {
  code?: number;
  success?: boolean;
  result?: {
    seasonTeamStats?: NaverSeasonTeam[];
  };
};

export function adaptRankings(json: NaverSeasonResponse) {
  const list = json?.result?.seasonTeamStats || [];
  return list
    .map((t) => ({
      rank: Number(t.ranking || 0),
      team: String(t.teamName || t.teamId || ""),
      logo: String(t.teamImageUrl || ""),
      wins: Number(t.winGameCount || 0),
      draws: Number(t.drawnGameCount || 0),
      losses: Number(t.loseGameCount || 0),
      winRate: Number(t.wra || 0),
      gameDiff: Number(t.gameBehind || 0),
      streak: String(t.continuousGameResult || ""),
    }))
    .filter((r) => r.rank > 0 && r.team)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}

export function adaptOffense(json: NaverSeasonResponse) {
  const list = json?.result?.seasonTeamStats || [];
  return list
    .map((t) => ({
      rank: Number(t.ranking || 0),
      team: String(t.teamName || t.teamId || ""),
      logo: String(t.teamImageUrl || ""),
      avg: Number(t.offenseHra || 0),
      runs: Number(t.offenseRun || 0),
      rbi: Number(t.offenseRbi || 0),
      hr: Number(t.offenseHr || 0),
      bb: Number(t.offenseBbhp || 0),
      so: Number(t.offenseKk || 0),
      doubles: Number(t.offenseH2 || 0),
      triples: Number(t.offenseH3 || 0),
      sb: Number(t.offenseSb || 0),
      hbp: 0,
      errors: 0,
      dp: Number(t.offenseGd || 0),
      obp: Number(t.offenseObp || 0),
      slg: Number(t.offenseSlg || 0),
      ops: Number(t.offenseOps || 0),
    }))
    .filter((r) => r.rank > 0 && r.team)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}

export function adaptDefense(json: NaverSeasonResponse) {
  const list = json?.result?.seasonTeamStats || [];
  return list
    .map((t) => ({
      rank: Number(t.ranking || 0),
      team: String(t.teamName || t.teamId || ""),
      logo: String(t.teamImageUrl || ""),
      era: Number(t.defenseEra || 0),
      runs: Number(t.defenseR || 0),
      er: Number(t.defenseEr || 0),
      innings: String(t.defenseInning ?? ""),
      hits: Number(t.defenseHit || 0),
      hr: Number(t.defenseHr || 0),
      so: Number(t.defenseKk || 0),
      bb: Number(t.defenseBbhp || 0),
      holds: Number(t.defenseHold || 0),
      errors: Number(t.defenseErr || 0),
      whip: Number(t.defenseWhip || 0),
      qs: Number(t.defenseQs || 0),
      holds2: Number(t.defenseHold || 0),
      saves: Number(t.defenseSave || 0),
    }))
    .filter((r) => r.rank > 0 && r.team)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}


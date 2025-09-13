export type GameResult = {
  id: string
  date: string // YYYY-MM-DD
  time: string
  status: "completed" | "scheduled" | "cancelled" | "postponed"
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  stadium: string
  tv?: string
  review?: boolean
  highlights?: boolean
  note?: string
}

export const teamColors: Record<string, string> = {
  LG: "#6D23F9",
  NC: "#1E3A8A",
  두산: "#1F2937",
  KIA: "#DC2626",
  키움: "#7C3AED",
  한화: "#EA580C",
  SSG: "#EF4444",
  KT: "#111827",
  삼성: "#2563EB",
  롯데: "#0EA5E9",
}

export const stadiumInfo: Record<string, string> = {
  잠실: "잠실야구장",
  대구: "대구삼성라이온즈파크",
  광주: "광주기아챔피언스필드",
  대전: "대전한화생명이글스파크",
  문학: "인천SSG랜더스필드",
  수원: "수원KT위즈파크",
}

export const gamesData: GameResult[] = [
  // Yesterday (completed examples)
  {
    id: "2024-09-11-LG-NC",
    date: "2024-09-11",
    time: "18:30",
    status: "completed",
    homeTeam: "LG",
    awayTeam: "NC",
    homeScore: 3,
    awayScore: 2,
    stadium: "잠실",
    tv: "SPO-T",
    review: true,
    highlights: true,
  },
  {
    id: "2024-09-11-두산-KIA",
    date: "2024-09-11",
    time: "18:30",
    status: "completed",
    homeTeam: "두산",
    awayTeam: "KIA",
    homeScore: 6,
    awayScore: 5,
    stadium: "광주",
    tv: "MS-T",
    review: true,
    highlights: false,
  },
  // Today (mix of scheduled and cancelled/postponed examples)
  {
    id: "2024-09-12-NC-LG",
    date: "2024-09-12",
    time: "18:30",
    status: "scheduled",
    homeTeam: "NC",
    awayTeam: "LG",
    stadium: "잠실",
    tv: "SS-T",
  },
  {
    id: "2024-09-12-두산-KIA",
    date: "2024-09-12",
    time: "18:30",
    status: "scheduled",
    homeTeam: "두산",
    awayTeam: "KIA",
    stadium: "광주",
    tv: "SPO-2T",
  },
  {
    id: "2024-09-12-키움-한화",
    date: "2024-09-12",
    time: "18:30",
    status: "scheduled",
    homeTeam: "키움",
    awayTeam: "한화",
    stadium: "대전",
    tv: "KN-T",
  },
]


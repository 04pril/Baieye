"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface TeamRanking {
  rank: number
  team: string
  logo: string
  winRate: number
  gameDiff: number
  wins: number
  draws: number
  losses: number
  games: number
  streak: string
}

interface OffensiveStats {
  rank: number
  team: string
  logo: string
  avg: number
  runs: number
  rbi: number
  hr: number
  bb: number
  so: number
  doubles: number
  triples: number
  sb: number
  hbp: number
  errors: number
  dp: number
  obp: number
  slg: number
  ops: number
}

interface DefensiveStats {
  rank: number
  team: string
  logo: string
  era: number
  runs: number
  er: number
  innings: string
  hits: number
  hr: number
  so: number
  bb: number
  holds: number
  errors: number
  whip: number
  qs: number
  holds2: number
  saves: number
}

export default function KBORankingsPage() {
  // 로고 렌더링 함수
  const renderLogo = (logo: string, alt: string) => {
    if (logo && (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/logos/"))) {
      return (
        <img
          src={logo}
          alt={alt}
          width={24}
          height={24}
          referrerPolicy="no-referrer"
          className="rounded-sm"
          loading="lazy"
        />
      )
    }
    return <span className="text-xl">{logo || "⚾"}</span>
  }

  // 스켈레톤 로딩
  const Lines = ({ rows = 10 }: { rows?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200/80 rounded animate-pulse" />
      ))}
    </div>
  )

  // 상태
  const [rankings, setRankings] = useState<TeamRanking[]>([])
  const [rankingsLoaded, setRankingsLoaded] = useState(false)
  const [offensiveStats, setOffensiveStats] = useState<OffensiveStats[]>([])
  const [offenseLoaded, setOffenseLoaded] = useState(false)
  const [defensiveStats, setDefensiveStats] = useState<DefensiveStats[]>([])
  const [defenseLoaded, setDefenseLoaded] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // 데이터 fetch 공통
  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        // 순위
        const resRanks = await fetch("/api/kbo-rankings", { cache: "no-store" })
        if (resRanks.ok) {
          const data = await resRanks.json()
          if (data?.ok && Array.isArray(data.rankings) && !cancelled) {
            const normalized = data.rankings.map((r: any) => ({
              rank: Number(r.rank || 0),
              team: String(r.team || ""),
              logo: String(r.logo || ""),
              winRate: typeof r.winRate === "number" ? r.winRate : 0,
              gameDiff: Number(r.gameDiff || 0),
              wins: Number(r.wins || 0),
              draws: Number(r.draws || 0),
              losses: Number(r.losses || 0),
              games: Number(r.wins || 0) + Number(r.draws || 0) + Number(r.losses || 0),
              streak: String(r.streak || ""),
            }))
            setRankings(normalized)
            setRankingsLoaded(true)
            if (data.updatedAt) setUpdatedAt(data.updatedAt)
          }
        }

        // 공격
        const resOff = await fetch("/api/kbo-offense", { cache: "no-store" })
        if (resOff.ok) {
          const data = await resOff.json()
          if (data?.ok && Array.isArray(data.offense) && !cancelled) {
            setOffensiveStats(data.offense)
            setOffenseLoaded(true)
          }
        }

        // 수비
        const resDef = await fetch("/api/kbo-defense", { cache: "no-store" })
        if (resDef.ok) {
          const data = await resDef.json()
          if (data?.ok && Array.isArray(data.defense) && !cancelled) {
            setDefensiveStats(data.defense)
            setDefenseLoaded(true)
          }
        }
      } catch (e) {
        console.error("fetch error", e)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-900">
            BAIEYE
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
            홈으로
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">2025 KBO 시즌 팀 기록</h1>
          <div className="w-full h-1 bg-gradient-to-r from-slate-800 to-slate-600 rounded-full"></div>
        </div>

        {/* 팀 순위 */}
        <div className="grid grid-cols-1 gap-8">
          {!rankingsLoaded ? (
            <div className="col-span-1">
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <Lines rows={12} />
              </div>
            </div>
          ) : (
            <div className="col-span-1">
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">팀 순위</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2">순위</th>
                        <th className="text-left py-3 px-2">팀</th>
                        <th className="text-center py-3 px-2">승률</th>
                        <th className="text-center py-3 px-2">게임차</th>
                        <th className="text-center py-3 px-2">승</th>
                        <th className="text-center py-3 px-2">무</th>
                        <th className="text-center py-3 px-2">패</th>
                        <th className="text-center py-3 px-2">경기</th>
                        <th className="text-center py-3 px-2">연속</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((team, index) => (
                        <tr
                          key={team.rank}
                          className={`border-b border-gray-100 hover:bg-slate-50/50 ${
                            index < 5 ? "bg-green-50/30" : index >= 8 ? "bg-red-50/30" : ""
                          }`}
                        >
                          <td className="py-4 px-2">
                            <span className="font-bold">{team.rank}</span>
                          </td>
                          <td className="py-4 px-2 flex items-center space-x-3">
                            {renderLogo(team.logo, team.team)}
                            <span>{team.team}</span>
                          </td>
                          <td className="py-4 px-2 text-center text-blue-600 font-semibold">
                            {team.winRate.toFixed(3)}
                          </td>
                          <td className="py-4 px-2 text-center">{team.gameDiff}</td>
                          <td className="py-4 px-2 text-center">{team.wins}</td>
                          <td className="py-4 px-2 text-center">{team.draws}</td>
                          <td className="py-4 px-2 text-center">{team.losses}</td>
                          <td className="py-4 px-2 text-center">{team.games}</td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                team.streak.includes("승") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {team.streak}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 공격 지표 */}
        {/* 그대로 유지, offenseLoaded와 offensiveStats 활용 */}

        {/* 수비 지표 */}
        {/* 그대로 유지, defenseLoaded와 defensiveStats 활용 */}

        {/* 업데이트 정보 */}
        <div className="mt-8 text-center text-sm text-slate-600">
          순위는 매일 오후 11시에 자동 업데이트됩니다.
          <br />
          데이터 출처: 네이버 스포츠
          {updatedAt && (
            <div className="mt-1 text-xs text-slate-500">
              최근 업데이트: {new Date(updatedAt).toLocaleTimeString("ko-KR")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
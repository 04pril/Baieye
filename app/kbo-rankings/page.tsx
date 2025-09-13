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
  // 로고 렌더링
  const renderLogo = (logo: string, alt: string) =>
    logo ? (
      <img
        src={logo}
        alt={alt}
        width={24}
        height={24}
        referrerPolicy="no-referrer"
        className="rounded-sm"
        loading="lazy"
      />
    ) : (
      <span className="text-xl">⚾</span>
    )

  // 스켈레톤
  const Lines = ({ rows = 10 }: { rows?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200/80 rounded animate-pulse" />
      ))}
    </div>
  )

  // 상태
  const [rankings, setRankings] = useState<TeamRanking[]>([])
  const [offensiveStats, setOffensiveStats] = useState<OffensiveStats[]>([])
  const [defensiveStats, setDefensiveStats] = useState<DefensiveStats[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  const [rankingsLoaded, setRankingsLoaded] = useState(false)
  const [offenseLoaded, setOffenseLoaded] = useState(false)
  const [defenseLoaded, setDefenseLoaded] = useState(false)

  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // fetch
  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const [resRanks, resOff, resDef] = await Promise.all([
          fetch("/api/kbo-rankings", { cache: "no-store" }),
          fetch("/api/kbo-offense", { cache: "no-store" }),
          fetch("/api/kbo-defense", { cache: "no-store" }),
        ])

        if (resRanks.ok) {
          const data = await resRanks.json()
          if (!cancelled && data?.ok) {
            setRankings(
              data.rankings.map((r: any) => ({
                rank: Number(r.rank || 0),
                team: String(r.team || ""),
                logo: String(r.logo || ""),
                winRate: Number(r.winRate || 0),
                gameDiff: Number(r.gameDiff || 0),
                wins: Number(r.wins || 0),
                draws: Number(r.draws || 0),
                losses: Number(r.losses || 0),
                games: Number(r.wins || 0) + Number(r.draws || 0) + Number(r.losses || 0),
                streak: String(r.streak || ""),
              }))
            )
            setRankingsLoaded(true)
            if (data.updatedAt) setUpdatedAt(data.updatedAt)
          }
        }

        if (resOff.ok) {
          const data = await resOff.json()
          if (!cancelled && data?.ok) {
            setOffensiveStats(data.offense)
            setOffenseLoaded(true)
          }
        }

        if (resDef.ok) {
          const data = await resDef.json()
          if (!cancelled && data?.ok) {
            setDefensiveStats(data.defense)
            setDefenseLoaded(true)
          }
        }
      } catch (err) {
        console.error("fetch error", err)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [])

  // 테이블 셀 스타일 헬퍼
  const highlight = (col: string, value: any, fixed?: number) => (
    <span
      className={`transition-colors ${
        hoveredColumn === col || selectedColumn === col ? "text-blue-600 font-semibold" : "text-slate-700"
      }`}
    >
      {typeof value === "number" && fixed !== undefined ? value.toFixed(fixed) : value}
    </span>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-900">
            BAIEYE
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
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
            <div className="bg-white/90 rounded-2xl shadow-lg p-6">
              <Lines rows={12} />
            </div>
          ) : (
            <div className="bg-white/90 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">팀 순위</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-2">순위</th>
                      <th className="py-3 px-2">팀</th>
                      <th className="py-3 px-2 text-center">승률</th>
                      <th className="py-3 px-2 text-center">게임차</th>
                      <th className="py-3 px-2 text-center">승</th>
                      <th className="py-3 px-2 text-center">무</th>
                      <th className="py-3 px-2 text-center">패</th>
                      <th className="py-3 px-2 text-center">경기</th>
                      <th className="py-3 px-2 text-center">연속</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((t, i) => (
                      <tr
                        key={t.rank}
                        className={`border-b border-gray-100 hover:bg-slate-50/50 ${
                          i < 5 ? "bg-green-50/30" : i >= 8 ? "bg-red-50/30" : ""
                        }`}
                      >
                        <td className="py-3 px-2 font-bold">{t.rank}</td>
                        <td className="py-3 px-2 flex items-center space-x-2">
                          {renderLogo(t.logo, t.team)}
                          <span>{t.team}</span>
                        </td>
                        <td className="py-3 px-2 text-center text-blue-600 font-semibold">{t.winRate.toFixed(3)}</td>
                        <td className="py-3 px-2 text-center">{t.gameDiff}</td>
                        <td className="py-3 px-2 text-center">{t.wins}</td>
                        <td className="py-3 px-2 text-center">{t.draws}</td>
                        <td className="py-3 px-2 text-center">{t.losses}</td>
                        <td className="py-3 px-2 text-center">{t.games}</td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              t.streak.includes("승") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {t.streak}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 공격 지표 */}
        <div className="mt-8 bg-white/90 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">공격 지표</h2>
          {!offenseLoaded ? (
            <Lines rows={10} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2">순위</th>
                    <th className="py-3 px-2">팀</th>
                    {["avg", "runs", "rbi", "hr", "bb", "so", "doubles", "triples", "sb", "hbp", "errors", "dp", "obp", "slg", "ops"].map((col) => (
                      <th
                        key={col}
                        className="py-3 px-2 text-center cursor-pointer hover:text-blue-600"
                        onMouseEnter={() => setHoveredColumn(col)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => setSelectedColumn(selectedColumn === col ? null : col)}
                      >
                        {col.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {offensiveStats.map((t) => (
                    <tr key={t.rank} className="border-b border-gray-100 hover:bg-slate-50/50">
                      <td className="py-3 px-2">{t.rank}</td>
                      <td className="py-3 px-2 flex items-center space-x-2">
                        {renderLogo(t.logo, t.team)}
                        <span>{t.team}</span>
                      </td>
                      <td className="text-center">{highlight("avg", t.avg, 3)}</td>
                      <td className="text-center">{highlight("runs", t.runs)}</td>
                      <td className="text-center">{highlight("rbi", t.rbi)}</td>
                      <td className="text-center">{highlight("hr", t.hr)}</td>
                      <td className="text-center">{highlight("bb", t.bb)}</td>
                      <td className="text-center">{highlight("so", t.so)}</td>
                      <td className="text-center">{highlight("doubles", t.doubles)}</td>
                      <td className="text-center">{highlight("triples", t.triples)}</td>
                      <td className="text-center">{highlight("sb", t.sb)}</td>
                      <td className="text-center">{highlight("hbp", t.hbp)}</td>
                      <td className="text-center">{highlight("errors", t.errors)}</td>
                      <td className="text-center">{highlight("dp", t.dp)}</td>
                      <td className="text-center">{highlight("obp", t.obp, 3)}</td>
                      <td className="text-center">{highlight("slg", t.slg, 3)}</td>
                      <td className="text-center">{highlight("ops", t.ops, 3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 수비 지표 */}
        <div className="mt-8 bg-white/90 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">수비 지표</h2>
          {!defenseLoaded ? (
            <Lines rows={10} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2">순위</th>
                    <th className="py-3 px-2">팀</th>
                    {["era", "runs", "er", "innings", "hits", "hr", "so", "bb", "holds", "errors", "whip", "qs", "holds2", "saves"].map((col) => (
                      <th
                        key={col}
                        className="py-3 px-2 text-center cursor-pointer hover:text-blue-600"
                        onMouseEnter={() => setHoveredColumn(col)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => setSelectedColumn(selectedColumn === col ? null : col)}
                      >
                        {col.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {defensiveStats.map((t) => (
                    <tr key={t.rank} className="border-b border-gray-100 hover:bg-slate-50/50">
                      <td className="py-3 px-2">{t.rank}</td>
                      <td className="py-3 px-2 flex items-center space-x-2">
                        {renderLogo(t.logo, t.team)}
                        <span>{t.team}</span>
                      </td>
                      <td className="text-center">{highlight("era", t.era, 2)}</td>
                      <td className="text-center">{highlight("runs", t.runs)}</td>
                      <td className="text-center">{highlight("er", t.er)}</td>
                      <td className="text-center">{highlight("innings", t.innings)}</td>
                      <td className="text-center">{highlight("hits", t.hits)}</td>
                      <td className="text-center">{highlight("hr", t.hr)}</td>
                      <td className="text-center">{highlight("so", t.so)}</td>
                      <td className="text-center">{highlight("bb", t.bb)}</td>
                      <td className="text-center">{highlight("holds", t.holds)}</td>
                      <td className="text-center">{highlight("errors", t.errors)}</td>
                      <td className="text-center">{highlight("whip", t.whip, 2)}</td>
                      <td className="text-center">{highlight("qs", t.qs)}</td>
                      <td className="text-center">{highlight("holds2", t.holds2)}</td>
                      <td className="text-center">{highlight("saves", t.saves)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
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

  // 스켈레톤 로딩 컴포넌트
  const Lines = ({ rows = 10 }: { rows?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200/80 rounded animate-pulse" />
      ))}
    </div>
  )

  // 순위, 공격, 수비, 월별 데이터 상태
  const [rankings, setRankings] = useState<TeamRanking[]>([])
  const [rankingsLoaded, setRankingsLoaded] = useState(false)
  const [offensiveStats, setOffensiveStats] = useState<OffensiveStats[]>([])
  const [offenseLoaded, setOffenseLoaded] = useState(false)
  const [defensiveStats, setDefensiveStats] = useState<DefensiveStats[]>([])
  const [defenseLoaded, setDefenseLoaded] = useState(false)
  const [allTeamsMonthlyData, setAllTeamsMonthlyData] = useState<any[]>([])
  const [monthlyLoaded, setMonthlyLoaded] = useState(false)

  // 테이블 컬럼 hover/선택 상태
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // 순위 데이터 fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-rankings", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
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
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 월별 순위 데이터 fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-monthly", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data?.ok && Array.isArray(data.series)) {
          const colors: Record<string, string> = {
            LG: "#C41E3A",
            한화: "#FF6600",
            SSG: "#CE0E2D",
            롯데: "#041E42",
            삼성: "#074CA1",
            KT: "#000000",
            NC: "#315288",
            KIA: "#EA0029",
            두산: "#131230",
            키움: "#5A2D82",
          }
          const shaped = data.series.map((s: any) => ({
            team: s.team,
            color: colors[s.team] || "#64748b",
            data: (s.data || []).map((d: any) => ({ month: d.month, rank: d.rank })),
          }))
          setAllTeamsMonthlyData(shaped)
          setMonthlyLoaded(true)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 공격지표 fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-offense", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (data?.ok && Array.isArray(data.offense) && !cancelled) {
          const normalized = data.offense.map((r: any) => ({
            rank: Number(r.rank || 0),
            team: String(r.team || ""),
            logo: String(r.logo || ""),
            avg: Number(r.avg || 0),
            runs: Number(r.runs || 0),
            rbi: Number(r.rbi || 0),
            hr: Number(r.hr || 0),
            bb: Number(r.bb || 0),
            so: Number(r.so || 0),
            doubles: Number(r.doubles || 0),
            triples: Number(r.triples || 0),
            sb: Number(r.sb || 0),
            hbp: Number(r.hbp || 0),
            errors: Number(r.errors || 0),
            dp: Number(r.dp || 0),
            obp: Number(r.obp || 0),
            slg: Number(r.slg || 0),
            ops: Number(r.ops || 0),
          }))
          setOffensiveStats(normalized)
          setOffenseLoaded(true)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 수비지표 fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-defense", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (data?.ok && Array.isArray(data.defense) && !cancelled) {
          const normalized = data.defense.map((r: any) => ({
            rank: Number(r.rank || 0),
            team: String(r.team || ""),
            logo: String(r.logo || ""),
            era: Number(r.era || 0),
            runs: Number(r.runs || 0),
            er: Number(r.er || 0),
            innings: String(r.innings || ""),
            hits: Number(r.hits || 0),
            hr: Number(r.hr || 0),
            so: Number(r.so || 0),
            bb: Number(r.bb || 0),
            holds: Number(r.holds || 0),
            errors: Number(r.errors || 0),
            whip: Number(r.whip || 0),
            qs: Number(r.qs || 0),
            holds2: Number(r.holds2 || 0),
            saves: Number(r.saves || 0),
          }))
          setDefensiveStats(normalized)
          setDefenseLoaded(true)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 순위 데이터 자동 업데이트 타이머 (23:00)
  useEffect(() => {
    const updateRankings = () => {
      // 실제 데이터 업데이트 로직 필요시 구현
      // 예: setRankingsLoaded(false); fetch 순위 데이터 등
    }

    const now = new Date()
    const nextUpdate = new Date()
    nextUpdate.setHours(23, 0, 0, 0)
    if (now.getHours() >= 23) nextUpdate.setDate(nextUpdate.getDate() + 1)
    const timeUntilUpdate = nextUpdate.getTime() - now.getTime()

    const timer = setTimeout(() => {
      updateRankings()
      setInterval(updateRankings, 24 * 60 * 60 * 1000)
    }, timeUntilUpdate)

    return () => clearTimeout(timer)
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">2025 KBO 시즌 팀 기록</h1>
          <div className="w-full h-1 bg-gradient-to-r from-slate-800 to-slate-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* 팀순위 테이블 */}
          {!rankingsLoaded && (
            <div className="col-span-1">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6">
                <Lines rows={12} />
              </div>
            </div>
          )}
          <div className="col-span-1" style={{ display: rankingsLoaded ? "block" : "none" }}>
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">팀 순위</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-slate-700">순위</th>
                      <th className="text-left py-3 px-2 font-semibold text-slate-700">팀</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">승률</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">게임차</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">승</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">무</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">패</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">경기</th>
                      <th className="text-center py-3 px-2 font-semibold text-slate-700">연속</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((team, index) => (
                      <tr
                        key={team.rank}
                        className={`border-b border-gray-100 hover:bg-slate-50/50 transition-colors ${
                          index < 5 ? "bg-green-50/30" : index >= 8 ? "bg-red-50/30" : ""
                        }`}
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center">
                            <div
                              className={`w-1 h-8 rounded-full mr-3 ${
                                index < 5 ? "bg-green-500" : index >= 8 ? "bg-red-500" : "bg-blue-500"
                              }`}
                            ></div>
                            <span className="font-bold text-slate-900">{team.rank}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            {renderLogo(team.logo, team.team)}
                            <span className="font-semibold text-slate-900">{team.team}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="text-blue-600 font-semibold">{team.winRate.toFixed(3)}</span>
                        </td>
                        <td className="py-4 px-2 text-center text-slate-700">{team.gameDiff}</td>
                        <td className="py-4 px-2 text-center text-slate-700">{team.wins}</td>
                        <td className="py-4 px-2 text-center text-slate-700">{team.draws}</td>
                        <td className="py-4 px-2 text-center text-slate-700">{team.losses}</td>
                        <td className="py-4 px-2 text-center text-slate-700">{team.games}</td>
                        <td className="py-4 px-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        </div>

        {/* 공격지표 */}
        <div className="mt-8">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">공격 지표</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-slate-700">순위</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700">팀</th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("avg")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "avg" ? null : "avg")}
                    >
                      타율
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("runs")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "runs" ? null : "runs")}
                    >
                      득점
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("rbi")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "rbi" ? null : "rbi")}
                    >
                      타점
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("hr")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "hr" ? null : "hr")}
                    >
                      홈런
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("bb")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "bb" ? null : "bb")}
                    >
                      볼넷
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("so")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "so" ? null : "so")}
                    >
                      삼진
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("doubles")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "doubles" ? null : "doubles")}
                    >
                      2루타
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("triples")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "triples" ? null : "triples")}
                    >
                      3루타
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("sb")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "sb" ? null : "sb")}
                    >
                      도루
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("hbp")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "hbp" ? null : "hbp")}
                    >
                      사사구
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("errors")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "errors" ? null : "errors")}
                    >
                      실책
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("dp")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "dp" ? null : "dp")}
                    >
                      병살타
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("obp")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "obp" ? null : "obp")}
                    >
                      출루율
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("slg")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "slg" ? null : "slg")}
                    >
                      장타율
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("ops")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "ops" ? null : "ops")}
                    >
                      OPS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offenseLoaded
                    ? offensiveStats.map((team, index) => (
                        <tr key={team.rank} className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-2">
                            <span className="font-bold text-slate-900">{team.rank}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              {renderLogo(team.logo, team.team)}
                              <span className="font-semibold text-slate-900">{team.team}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`font-semibold transition-colors ${
                                hoveredColumn === "avg" || selectedColumn === "avg" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.avg.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "runs" || selectedColumn === "runs" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.runs}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "rbi" || selectedColumn === "rbi" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.rbi}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "hr" || selectedColumn === "hr" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.hr}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "bb" || selectedColumn === "bb" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.bb}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "so" || selectedColumn === "so" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.so}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "doubles" || selectedColumn === "doubles"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.doubles}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "triples" || selectedColumn === "triples"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.triples}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "sb" || selectedColumn === "sb" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.sb}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "hbp" || selectedColumn === "hbp" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.hbp}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "errors" || selectedColumn === "errors"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.errors}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "dp" || selectedColumn === "dp" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.dp}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "obp" || selectedColumn === "obp" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.obp.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "slg" || selectedColumn === "slg" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.slg.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "ops" || selectedColumn === "ops" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.ops.toFixed(3)}
                            </span>
                          </td>
                        </tr>
                      ))
                    : Array.from({ length: 10 }).map((_, i) => (
                        <tr key={`off-skel-${i}`} className="border-b border-gray-100">
                          <td colSpan={20} className="py-4 px-2">
                            <div className="h-4 bg-slate-200/80 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 수비지표 */}
        <div className="mt-8">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">수비 지표</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-slate-700">순위</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700">팀</th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("era")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "era" ? null : "era")}
                    >
                      평균자책점
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("def_runs")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "def_runs" ? null : "def_runs")}
                    >
                      실점
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("er")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "er" ? null : "er")}
                    >
                      자책점
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("innings")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "innings" ? null : "innings")}
                    >
                      이닝
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("hits")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "hits" ? null : "hits")}
                    >
                      피안타
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("def_hr")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "def_hr" ? null : "def_hr")}
                    >
                      피홈런
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("def_so")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "def_so" ? null : "def_so")}
                    >
                      탈삼진
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("def_bb")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "def_bb" ? null : "def_bb")}
                    >
                      사사구
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("holds")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "holds" ? null : "holds")}
                    >
                      홀드
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("def_errors")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "def_errors" ? null : "def_errors")}
                    >
                      실책
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("whip")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "whip" ? null : "whip")}
                    >
                      WHIP
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("qs")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "qs" ? null : "qs")}
                    >
                      QS
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("holds2")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "holds2" ? null : "holds2")}
                    >
                      홀드
                    </th>
                    <th
                      className="text-center py-3 px-2 font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setHoveredColumn("saves")}
                      onMouseLeave={() => setHoveredColumn(null)}
                      onClick={() => setSelectedColumn(selectedColumn === "saves" ? null : "saves")}
                    >
                      세이브
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {defenseLoaded
                    ? defensiveStats.map((team, index) => (
                        <tr key={team.rank} className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-2">
                            <span className="font-bold text-slate-900">{team.rank}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              {renderLogo(team.logo, team.team)}
                              <span className="font-semibold text-slate-900">{team.team}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`font-semibold transition-colors ${
                                hoveredColumn === "era" || selectedColumn === "era" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.era.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "def_runs" || selectedColumn === "def_runs"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.runs}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "er" || selectedColumn === "er" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.er}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "innings" || selectedColumn === "innings"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.innings}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "hits" || selectedColumn === "hits" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.hits}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "def_hr" || selectedColumn === "def_hr"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.hr}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "def_so" || selectedColumn === "def_so"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.so}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "def_bb" || selectedColumn === "def_bb"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.bb}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "holds" || selectedColumn === "holds" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.holds}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "def_errors" || selectedColumn === "def_errors"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.errors}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "whip" || selectedColumn === "whip" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.whip.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "qs" || selectedColumn === "qs" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.qs}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "holds2" || selectedColumn === "holds2"
                                  ? "text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {team.holds2}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={`transition-colors ${
                                hoveredColumn === "saves" || selectedColumn === "saves" ? "text-blue-600" : "text-slate-700"
                              }`}
                            >
                              {team.saves}
                            </span>
                          </td>
                        </tr>
                      ))
                    : Array.from({ length: 10 }).map((_, i) => (
                        <tr key={`def-skel-${i}`} className="border-b border-gray-100">
                          <td colSpan={20} className="py-4 px-2">
                            <div className="h-4 bg-slate-200/80 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 업데이트 정보 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            순위는 매일 오후 11시에 자동 업데이트됩니다.
            <br />
            데이터 출처: 네이버 스포츠
          </p>
        </div>
      </div>
    </div>
  )
}

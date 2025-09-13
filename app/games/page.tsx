"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { gamesData as fallbackGames, teamColors, stadiumInfo, type GameResult } from "@/lib/games-data"

export default function GamesPage() {
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [allGames, setAllGames] = useState<GameResult[]>(fallbackGames)
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState("09")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/kbo-schedule/month?year=${year}&month=${month}`)
        if (!res.ok) return
        const data = await res.json()
        const apiGames: any[] = Array.isArray(data?.games) ? data.games : []
        let mapped: GameResult[] = apiGames.map((g: any, idx: number) => ({
          id: `${g.date || `${year}-${month}`}-${idx}`,
          date: g.date,
          time: g.time || "",
          status: (g.status && (g.status.includes("경기 종료") ? "completed" : g.status.includes("취소") ? "cancelled" : g.status.includes("연기") ? "postponed" : "scheduled")) || "scheduled",
          homeTeam: g.homeTeam,
          awayTeam: g.awayTeam,
          homeScore: typeof g.homeScore === 'number' ? g.homeScore : undefined,
          awayScore: typeof g.awayScore === 'number' ? g.awayScore : undefined,
          stadium: g.stadium || "",
          tv: Array.isArray(g.broadcasts) ? g.broadcasts.join(", ") : undefined,
          review: false,
          highlights: false,
        }))
        const nowLocal = new Date()
        const utc = nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60000
        const kst = new Date(utc + 9 * 3600 * 1000)
        const todayStr = `${kst.getFullYear()}-${String(kst.getMonth() + 1).padStart(2, '0')}-${String(kst.getDate()).padStart(2, '0')}`
        mapped = mapped.map((m) => {
          const hasScores = typeof m.homeScore === 'number' && typeof m.awayScore === 'number'
          const isPast = m.date && m.date < todayStr
          let status = m.status
          if (hasScores) status = 'completed'
          else if (isPast && (status === 'scheduled' || !status)) status = 'completed'
          return { ...m, status }
        })
        if (!cancelled && mapped.length) setAllGames(mapped)
      } catch {
        // fallback 유지
      }
    }
    load()
    return () => { cancelled = true }
  }, [year, month])

  const nowLocal = new Date()
  const utcMs = nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60000
  const kstNow = new Date(utcMs + 9 * 3600 * 1000)
  const today = `${kstNow.getFullYear()}-${String(kstNow.getMonth() + 1).padStart(2, '0')}-${String(kstNow.getDate()).padStart(2, '0')}`
  const ydt = new Date(kstNow.getTime() - 24 * 3600 * 1000)
  const yesterday = `${ydt.getFullYear()}-${String(ydt.getMonth() + 1).padStart(2, '0')}-${String(ydt.getDate()).padStart(2, '0')}`
  const tmr = new Date(kstNow.getTime() + 24 * 3600 * 1000)
  const tomorrow = `${tmr.getFullYear()}-${String(tmr.getMonth() + 1).padStart(2, '0')}-${String(tmr.getDate()).padStart(2, '0')}`

  // Fast slices for today/yesterday/tomorrow used in top highlight
  const todayGames = useMemo(() => allGames.filter((g) => g.date === today), [allGames, today])
  const yesterdayGames = useMemo(() => allGames.filter((g) => g.date === yesterday), [allGames, yesterday])
  const tomorrowGames = useMemo(() => allGames.filter((g) => g.date === tomorrow), [allGames, tomorrow])

  const dates = useMemo(() => {
    const uniqueDates = Array.from(new Set(allGames.map((game) => game.date)))
    return uniqueDates.sort()
  }, [allGames])

  const teams = useMemo(() => {
    const allTeams = new Set<string>()
    allGames.forEach((game) => {
      allTeams.add(game.homeTeam)
      allTeams.add(game.awayTeam)
    })
    return Array.from(allTeams).sort()
  }, [allGames])

  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const dateMatch = selectedDate === "all" || game.date === selectedDate
      const teamMatch = selectedTeam === "all" || game.homeTeam === selectedTeam || game.awayTeam === selectedTeam
      const statusMatch = selectedStatus === "all" || game.status === selectedStatus
      return dateMatch && teamMatch && statusMatch
    })
  }, [allGames, selectedDate, selectedTeam, selectedStatus])

  const gamesByDate = useMemo(() => {
    const grouped = filteredGames.reduce((acc, game) => {
      if (!acc[game.date]) acc[game.date] = []
      acc[game.date].push(game)
      return acc
    }, {} as Record<string, GameResult[]>)

    const sortedDates = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

    return sortedDates.map((date) => ({
      date,
      games: grouped[date],
      isToday: date === today,
      isYesterday: date === yesterday,
    }))
  }, [filteredGames, today, yesterday])

  const getStatusBadge = (status: GameResult["status"], note?: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">경기 종료</span>
      case "scheduled":
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">예정</span>
      case "cancelled":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">{note || "취소"}</span>
      case "postponed":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">연기</span>
      default:
        return null
    }
  }

  const getTeamBadge = (team: string) => {
    const color = teamColors[team] || "#6B7280"
    return (
      <span className="px-3 py-1 text-sm font-bold text-white rounded-lg" style={{ backgroundColor: color }}>
        {team}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
    return `${month}월 ${day}일 (${dayOfWeek})`
  }

  const getDateHeaderStyle = (_isToday: boolean, _isYesterday: boolean) => {
    return "bg-slate-800 text-white"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-900">
            BAIEYE
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/players" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              선수 목록
            </Link>
            <Link href="/top20" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              TOP 20
            </Link>
            <Link href="/games" className="text-slate-900 font-bold">
              경기 결과
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="border-l-4 border-slate-800 pl-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">KBO 경기 결과</h1>
          <p className="text-slate-600 mt-2">2025년 9월 KBO 리그 경기 일정 및 결과</p>
        </div>

        {(todayGames.length > 0 || yesterdayGames.length > 0 || tomorrowGames.length > 0) && (
          <div className="mb-8 space-y-6">
            {todayGames.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-blue-900">오늘 경기 ({formatDate(today)})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayGames.slice(0, 3).map((game) => (
                    <div key={game.id} className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">{game.time}</span>
                        {getStatusBadge(game.status, game.note)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTeamBadge(game.homeTeam)}
                          <span className="text-lg font-bold">{game.homeScore !== undefined ? game.homeScore : ""}</span>
                        </div>
                        <span className="text-slate-400 font-medium">VS</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{game.awayScore !== undefined ? game.awayScore : ""}</span>
                          {getTeamBadge(game.awayTeam)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {yesterdayGames.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-emerald-900">어제 경기 ({formatDate(yesterday)})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yesterdayGames.slice(0, 3).map((game) => (
                    <div key={game.id} className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">{game.time}</span>
                        {getStatusBadge(game.status, game.note)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTeamBadge(game.homeTeam)}
                          <span className="text-lg font-bold">{game.homeScore !== undefined ? game.homeScore : ""}</span>
                        </div>
                        <span className="text-slate-400 font-medium">VS</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{game.awayScore !== undefined ? game.awayScore : ""}</span>
                          {getTeamBadge(game.awayTeam)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

            {tomorrowGames.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-indigo-900">내일 경기 ({formatDate(tomorrow)})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tomorrowGames.slice(0, 3).map((game) => (
                    <div key={game.id} className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">{game.time}</span>
                        {getStatusBadge(game.status, game.note)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTeamBadge(game.homeTeam)}
                          <span className="text-lg font-bold">{game.homeScore !== undefined ? game.homeScore : ""}</span>
                        </div>
                        <span className="text-slate-400 font-medium">VS</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{game.awayScore !== undefined ? game.awayScore : ""}</span>
                          {getTeamBadge(game.awayTeam)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">날짜</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
              >
                <option value="all">전체 날짜</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">팀</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
              >
                <option value="all">전체 팀</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">상태</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
              >
                <option value="all">전체 상태</option>
                <option value="completed">경기 종료</option>
                <option value="scheduled">예정</option>
                <option value="cancelled">취소</option>
                <option value="postponed">연기</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {gamesByDate.map((dateGroup) => (
            <div key={dateGroup.date} className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`px-6 py-3 rounded-xl shadow-lg ${getDateHeaderStyle(dateGroup.isToday, dateGroup.isYesterday)}`}>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold">{formatDate(dateGroup.date)}</h2>
                    {dateGroup.isToday && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">TODAY</span>}
                    {dateGroup.isYesterday && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">어제</span>}
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                <div className="text-sm text-slate-500 font-medium">{dateGroup.games.length}경기</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {dateGroup.games.map((game, index) => (
                  <div
                    key={game.id}
                    className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="bg-slate-800 text-white p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">{game.time}</div>
                        {getStatusBadge(game.status, game.note)}
                      </div>
                      <div className="text-xs text-slate-300">{stadiumInfo[game.stadium] || game.stadium}</div>
                    </div>

                    <div className="p-6">
                      {game.status === "completed" && game.homeScore !== undefined && game.awayScore !== undefined ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTeamBadge(game.homeTeam)}
                              <span className="text-sm text-slate-600">홈팀</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{game.homeScore}</div>
                          </div>
                          <div className="text-center text-slate-400 font-medium">VS</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTeamBadge(game.awayTeam)}
                              <span className="text-sm text-slate-600">원정팀</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{game.awayScore}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTeamBadge(game.homeTeam)}
                              <span className="text-sm text-slate-600">홈팀</span>
                            </div>
                          </div>
                          <div className="text-center text-slate-400 font-medium">VS</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTeamBadge(game.awayTeam)}
                              <span className="text-sm text-slate-600">원정팀</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          {game.tv && <div className="text-xs text-slate-500">중계 {game.tv}</div>}
                        </div>
                        {game.status === "completed" && (
                          <div className="flex space-x-2">
                            {game.review && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">리뷰</span>}
                            {game.highlights && <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded">하이라이트</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {gamesByDate.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">일치하는 경기가 없습니다.</div>
          </div>
        )}

        <div className="mt-12 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">전체 경기 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{allGames.filter((g) => g.status === "completed").length}</div>
              <div className="text-sm text-slate-600">완료된 경기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{allGames.filter((g) => g.status === "scheduled").length}</div>
              <div className="text-sm text-slate-600">예정된 경기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{allGames.filter((g) => g.status === "cancelled").length}</div>
              <div className="text-sm text-slate-600">취소된 경기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{allGames.length}</div>
              <div className="text-sm text-slate-600">전체 경기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

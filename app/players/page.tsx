"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { players, teams, getPlayersByTeam, type Player } from "@/lib/players-data"

export default function PlayersPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")

  const filteredPlayers = useMemo(() => {
    let result: Player[] = selectedTeam === "all" ? players : getPlayersByTeam(selectedTeam)
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      result = result.filter((p) => [p.name, p.teamKorean, p.position].some((x) => x.toLowerCase().includes(q)))
    }

    const positionOrder: Record<string, number> = {
      "투수": 1,
      "포수": 2,
      "내야수": 3,
      "외야수": 4,
      // best-effort for mojibake fallbacks present in file
      "투수": 1,
      "내야수": 3,
      "외야수": 4,
    }

    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "ko")
        case "number":
          return (a.number ?? 0) - (b.number ?? 0)
        case "team":
          return a.teamKorean.localeCompare(b.teamKorean, "ko")
        case "position": {
          const av = positionOrder[a.position]
          const bv = positionOrder[b.position]
          if (av && bv) return av - bv
          if (av && !bv) return -1
          if (!av && bv) return 1
          return a.position.localeCompare(b.position, "ko")
        }
        default:
          return 0
      }
    })

    return sorted
  }, [selectedTeam, searchQuery, sortBy])

  const getPositionColor = (position: string) => {
    switch (position) {
      case "투수":
        return "bg-blue-100 text-blue-800"
      case "포수":
        return "bg-green-100 text-green-800"
      case "내야수":
        return "bg-orange-100 text-orange-800"
      case "외야수":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-900">
            BAIEYE
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              홈
            </Link>
            <Link href="/top20" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              TOP 20
            </Link>
            <Link href="/players" className="text-slate-900 font-medium">
              선수 목록
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="border-l-4 border-slate-800 pl-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">선수 목록</h1>
          <p className="text-slate-600 mt-1">KBO 리그 선수들을 팀별로 확인하고 검색해보세요</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">팀 선택</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">전체 팀</option>
                {teams.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">선수 검색</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="선수명, 팀명, 포지션으로 검색..."
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">정렬 기준</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="name">이름순 (가나다)</option>
                <option value="number">등번호순</option>
                <option value="team">팀명순</option>
                <option value="position">포지션순</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-600">
            총 <span className="font-semibold text-slate-900">{filteredPlayers.length}</span>명의 선수가 검색되었습니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <Link key={player.id} href={`/player/${player.id}`}>
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{player.name}</div>
                    <div className="text-sm text-slate-600">{player.teamKorean}</div>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">#{player.number}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  <div className="text-xs text-slate-500">상세보기 →</div>
                </div>
                {player.stats && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {player.position === "투수" ? (
                        <>
                          <div>
                            <span className="text-slate-500">ERA</span>
                            <div className="font-semibold">{player.stats.era?.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">승</span>
                            <div className="font-semibold">{player.stats.wins}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-slate-500">타율</span>
                            <div className="font-semibold">{player.stats.avg?.toFixed(3)}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">홈런</span>
                            <div className="font-semibold">{player.stats.homeRuns}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">검색 결과가 없습니다</div>
            <p className="text-slate-500">다른 검색어나 팀을 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

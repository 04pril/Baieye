"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type Categories = Record<string, { rank: number; name: string; team: string; value: string | number }[]>

export default function Top20Page() {
  const [activeTab, setActiveTab] = useState<"pitcher" | "batter">("pitcher")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const [pitcherCategories, setPitcherCategories] = useState<Categories>({})
  const [batterCategories, setBatterCategories] = useState<Categories>({})
  const [pitcherLoaded, setPitcherLoaded] = useState(false)
  const [batterLoaded, setBatterLoaded] = useState(false)

  const toggleExpanded = (category: string) => {
    const next = new Set(expandedCategories)
    next.has(category) ? next.delete(category) : next.add(category)
    setExpandedCategories(next)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-top?type=PITCHER", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data?.ok) {
          setPitcherCategories(data.categories || {})
          setPitcherLoaded(true)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/kbo-top?type=HITTER", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data?.ok) {
          setBatterCategories(data.categories || {})
          setBatterLoaded(true)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const getCurrentData = () => (activeTab === "pitcher" ? pitcherCategories : batterCategories)
  const isLoaded = activeTab === "pitcher" ? pitcherLoaded : batterLoaded

  const orderedKeys = useMemo(() => {
    return activeTab === "pitcher"
      ? ["era", "wins", "strikeouts", "saves", "whip", "war"]
      : ["average", "homeruns", "rbis", "steals", "ops", "war"]
  }, [activeTab])

  const getCategoryTitle = (key: string) => {
    const titles: Record<string, string> = {
      era: "평균자책",
      wins: "승수",
      strikeouts: "탈삼진",
      saves: "세이브",
      whip: "WHIP",
      average: "타율",
      homeruns: "홈런",
      rbis: "타점",
      steals: "도루",
      ops: "OPS",
      war: "WAR",
    }
    return titles[key] || key
  }

  const renderPlayerCard = (player: any, index: number, isExpanded: boolean) => {
    if (!isExpanded && index >= 4) return null
    return (
      <div
        key={`${player.rank}-${player.name}-${player.team}`}
        className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {player.rank}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{player.name}</div>
            <div className="text-xs text-slate-500">{player.team}</div>
          </div>
        </div>
        <div className="text-lg font-bold text-slate-900">{player.value}</div>
      </div>
    )
  }

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

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">TOP 20</h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center mt-6">
            <div className="bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/50">
              <button
                onClick={() => setActiveTab("pitcher")}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "pitcher" ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                투수
              </button>
              <button
                onClick={() => setActiveTab("batter")}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === "batter" ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                타자
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(orderedKeys.filter((k) => getCurrentData()[k]) as string[]).map((key, categoryIndex) => {
            const players = getCurrentData()[key] || []
            const isExpanded = expandedCategories.has(key)
            const categoryTitle = getCategoryTitle(key)

            return (
              <div
                key={key}
                className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${
                  categoryIndex % 2 === 0 ? "bg-slate-200/80" : "bg-slate-800 text-white"
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${categoryIndex % 2 === 0 ? "text-slate-900" : "text-white"}`}>
                  {categoryTitle}
                </h3>

                <div className="space-y-3">
                  {isLoaded
                    ? players.map((player: any, index: number) => renderPlayerCard(player, index, isExpanded))
                    : Array.from({ length: 6 }).map((_, i) => (
                        <div key={`sk-${key}-${i}`} className="h-10 bg-white/50 rounded animate-pulse" />
                      ))}

                  {players.length > 4 && (
                    <button
                      onClick={() => toggleExpanded(key)}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                        categoryIndex % 2 === 0
                          ? "bg-slate-800 text-white hover:bg-slate-700"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {isExpanded ? "접기" : "더 보기"}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

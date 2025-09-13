"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"
import { getPlayerById } from "@/lib/players-data"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from "recharts"

interface PlayerPageProps {
  params: { id: string }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const player = getPlayerById(params.id)
  if (!player) notFound()

  const seasonStats = {
    avg: player.stats?.avg?.toFixed(3) || ".000",
    games: "142",
    atBats: "548",
    hits: player.stats?.hits?.toString() || "0",
    homeRuns: player.stats?.homeRuns?.toString() || "0",
    doubles: "34",
    triples: "3",
    rbis: player.stats?.rbi?.toString() || "0",
    runs: player.stats?.runs?.toString() || "0",
    steals: "15",
    walks: "67",
    hitByPitch: "8",
    strikeouts: player.stats?.strikeouts?.toString() || "0",
  }

  const chartData =
    player.position === "투수"
      ? [
          { name: "ERA", korean: player.stats?.era || 0, total: 4.5 },
          { name: "승률", korean: ((player.stats?.wins || 0) / ((player.stats?.wins || 0) + (player.stats?.losses || 0) || 1)) * 100, total: 60 },
          { name: "WHIP", korean: 1.25, total: 1.35 },
          { name: "K/9", korean: ((player.stats?.strikeouts || 0) / 180) * 9, total: 8.5 },
        ]
      : [
          { name: "AVG", korean: (player.stats?.avg || 0) * 1000, total: 280 },
          { name: "출루율", korean: ((player.stats?.avg || 0) + 0.05) * 1000, total: 340 },
          { name: "OPS", korean: ((player.stats?.avg || 0) + 0.45) * 1000, total: 750 },
          { name: "WAR", korean: 3.2, total: 2.8 },
        ]

  const yearlyData =
    player.position === "투수"
      ? [
          { year: "2021", era: 4.12, wins: 8 },
          { year: "2022", era: 3.89, wins: 10 },
          { year: "2023", era: 4.23, wins: 7 },
          { year: "2024", era: 3.45, wins: 12 },
          { year: "2025", era: player.stats?.era || 3.5, wins: player.stats?.wins || 10 },
        ]
      : [
          { year: "2021", avg: 0.285, ops: 0.812 },
          { year: "2022", avg: 0.298, ops: 0.845 },
          { year: "2023", avg: 0.276, ops: 0.789 },
          { year: "2024", avg: 0.324, ops: 0.892 },
          { year: "2025", avg: player.stats?.avg || 0.28, ops: (player.stats?.avg || 0.28) + 0.45 },
        ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-lg md:text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            BAIEYE
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}></span>
              <span className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
              <span className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
            </div>
          </button>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">홈</Link>
            <Link href="/top20" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">TOP 20</Link>
            <Link href="/players" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">선수 목록</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 md:px-8 py-4 md:py-12 space-y-6">
        {/* Profile */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
            <div className="w-24 h-24 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
              <img src="/baseball-player-portrait.png" alt="선수 사진" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col items-center gap-2 mb-4 md:flex-row md:items-end md:gap-4 md:mb-6">
                <span className="text-3xl md:text-5xl font-black text-slate-800">#{player.number}</span>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900">{player.name}</h1>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm md:text-base md:grid-cols-4">
                <div><span className="font-semibold text-blue-600">팀:</span> <span className="text-slate-700">{player.teamKorean}</span></div>
                <div><span className="font-semibold text-blue-600">포지션:</span> <span className="text-slate-700">{player.position}</span></div>
                <div><span className="font-semibold text-blue-600">백넘버:</span> <span className="text-slate-700">{player.number}</span></div>
                <div><span className="font-semibold text-blue-600">나이:</span> <span className="text-slate-700">만 25세</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Season table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📊 2025 시즌 스탯</h2>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              {player.position === "투수" ? (
                <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["ERA","승","패","세이브","경기","이닝","삼진","볼넷","피안타"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 font-semibold text-blue-600 text-sm whitespace-nowrap border-r border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{player.stats?.era?.toFixed(2) || "0.00"}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{player.stats?.wins || 0}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{player.stats?.losses || 0}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{player.stats?.saves || 0}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">28</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">165.2</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{player.stats?.strikeouts || 0}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">45</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm">142</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse" style={{ minWidth: "1200px" }}>
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["AVG","경기","타수","안타","홈런","2루타","3루타","타점","득점","도루","볼넷","사구","삼진"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 font-semibold text-blue-600 text-sm whitespace-nowrap border-r border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.avg}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.games}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.atBats}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.hits}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.homeRuns}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.doubles}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.triples}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.rbis}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.runs}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.steals}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.walks}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm border-r border-gray-200">{seasonStats.hitByPitch}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm">{seasonStats.strikeouts}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recharts comparison */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📈 리그 비교</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {chartData.map((item, index) => (
                <div key={item.name} className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-blue-600 mb-4 text-center">{item.name}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[{ name: "선수", value: item.korean }, { name: "리그평균", value: item.total }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={10} />
                      <Bar dataKey="value" fill={index % 2 === 0 ? "#60a5fa" : "#34d399"} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yearly trend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📊 년도별 기록 추이</h2>
            <div className="h-64 md:h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyData as any[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  {player.position === "투수" ? (
                    <>
                      <Line type="monotone" dataKey="era" stroke="#60a5fa" strokeWidth={3} dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }} name="ERA" />
                      <Line type="monotone" dataKey="wins" stroke="#34d399" strokeWidth={3} dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }} name="승수" />
                    </>
                  ) : (
                    <>
                      <Line type="monotone" dataKey="avg" stroke="#60a5fa" strokeWidth={3} dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }} name="AVG" />
                      <Line type="monotone" dataKey="ops" stroke="#34d399" strokeWidth={3} dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }} name="OPS" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


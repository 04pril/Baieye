"use client"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { useState } from "react"

const playerData = {
  name: "이건",
  number: "20",
  age: "만 23세",
  position: "투수(RHP)",
  backNumber: "20",
  education: "한국초-한국중-한국고-한국대",
  height: "175CM",
  weight: "72KG",
  photo:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/540522480_798105246018531_6854658318223628741_n-OvMVRU2FBzKEImfsdDytPWmVewHmw6.png",
}

const seasonStats = {
  era: "3.45",
  games: "28",
  wins: "12",
  losses: "8",
  saves: "2",
  holds: "5",
  innings: "156.2",
  strikeouts: "142",
  hitsAllowed: "134",
  homerunsAllowed: "18",
  runsAllowed: "67",
  earnedRuns: "60",
  walks: "45",
  hitByPitch: "8",
}

const chartData = [
  { name: "ERA", korean: 8.2, total: 11.5 },
  { name: "WHIP", korean: 7.8, total: 10.2 },
  { name: "K/B", korean: 9.1, total: 12.3 },
  { name: "WAR", korean: 7.5, total: 10.8 },
]

const yearlyData = [
  { year: "2021", era: 4.2, avg: 3.8 },
  { year: "2022", era: 3.9, avg: 3.5 },
  { year: "2023", era: 4.8, avg: 4.1 },
  { year: "2024", era: 3.2, avg: 3.9 },
  { year: "2025", era: 5.1, avg: 4.3 },
]

const careerStats = [
  {
    year: "통산",
    era: "3.82",
    games: "156",
    wins: "67",
    losses: "45",
    saves: "8",
    holds: "23",
    innings: "892.1",
    strikeouts: "892",
    hitsAllowed: "798",
    homerunsAllowed: "89",
    runsAllowed: "401",
    earnedRuns: "379",
    walks: "267",
    hitByPitch: "45",
  },
  {
    year: "2025",
    era: "3.45",
    games: "28",
    wins: "12",
    losses: "8",
    saves: "2",
    holds: "5",
    innings: "156.2",
    strikeouts: "142",
    hitsAllowed: "134",
    homerunsAllowed: "18",
    runsAllowed: "67",
    earnedRuns: "60",
    walks: "45",
    hitByPitch: "8",
  },
  {
    year: "2024",
    era: "3.21",
    games: "32",
    wins: "15",
    losses: "9",
    saves: "1",
    holds: "4",
    innings: "189.1",
    strikeouts: "178",
    hitsAllowed: "156",
    homerunsAllowed: "21",
    runsAllowed: "78",
    earnedRuns: "68",
    walks: "52",
    hitByPitch: "9",
  },
  {
    year: "2023",
    era: "4.12",
    games: "29",
    wins: "11",
    losses: "12",
    saves: "2",
    holds: "6",
    innings: "167.2",
    strikeouts: "156",
    hitsAllowed: "178",
    homerunsAllowed: "24",
    runsAllowed: "89",
    earnedRuns: "77",
    walks: "58",
    hitByPitch: "12",
  },
  {
    year: "2022",
    era: "3.89",
    games: "31",
    wins: "14",
    losses: "8",
    saves: "1",
    holds: "3",
    innings: "178.1",
    strikeouts: "189",
    hitsAllowed: "167",
    homerunsAllowed: "19",
    runsAllowed: "82",
    earnedRuns: "77",
    walks: "49",
    hitByPitch: "7",
  },
  {
    year: "2021",
    era: "4.05",
    games: "36",
    wins: "15",
    losses: "8",
    saves: "2",
    holds: "5",
    innings: "200.1",
    strikeouts: "227",
    hitsAllowed: "163",
    homerunsAllowed: "7",
    runsAllowed: "85",
    earnedRuns: "90",
    walks: "63",
    hitByPitch: "9",
  },
]

export default function PlayerDetail() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
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
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
              ></span>
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
              ></span>
            </div>
          </button>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              SERVICES
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              GALLERY
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              INFORMATION
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              LOGIN
            </a>
          </nav>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200/50">
            <nav className="flex flex-col space-y-2 pt-3">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-slate-50"
              >
                SERVICES
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-slate-50"
              >
                GALLERY
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-slate-50"
              >
                INFORMATION
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-slate-50"
              >
                LOGIN
              </a>
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-3 md:px-8 py-4 md:py-12 space-y-4 md:space-y-8">
        {/* Player Profile Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
            <div className="w-24 h-24 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
              <img src="/baseball-player-portrait.png" alt="선수 사진" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col gap-1 mb-3 md:flex-row md:gap-4 md:mb-6">
                <span className="text-2xl md:text-5xl font-black text-slate-800">#{playerData.number}</span>
                <h1 className="text-xl md:text-4xl font-bold text-slate-900">{playerData.name}</h1>
              </div>
              <div className="grid grid-cols-1 gap-2 text-slate-700 text-xs md:text-base md:grid-cols-2 md:gap-3 text-right">
                <div className="space-y-1 md:space-y-2">
                  <p>
                    <span className="font-semibold text-blue-600">나이:</span> {playerData.age}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">포지션:</span> {playerData.position}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">키:</span> {playerData.height}
                  </p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <p>
                    <span className="font-semibold text-blue-600">백넘버:</span> {playerData.backNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">몸무게:</span> {playerData.weight}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">학력:</span>{" "}
                    <span className="text-xs">{playerData.education}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📊 2025 시즌 스탯</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      ERA
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      경기
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      승
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      패
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      세이브
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      홀드
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      이닝
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      탈삼진
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      피안타
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      피홈런
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      실점
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      자책점
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      볼넷
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap">
                      사구
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.era}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.games}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.wins}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.losses}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.saves}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.holds}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.innings}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.strikeouts}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.hitsAllowed}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.homerunsAllowed}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.runsAllowed}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.earnedRuns}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                      {seasonStats.walks}
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base">
                      {seasonStats.hitByPitch}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chart Comparison Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📈 리그 비교</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {chartData.map((item, index) => (
                <div key={item.name} className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-blue-600 mb-4 text-center">{item.name}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { name: "한국야구", value: item.korean },
                        { name: "전체", value: item.total },
                      ]}
                    >
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

        {/* Career Stats Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">🏆 캐리어 통산기록</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      년도
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      ERA
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      경기
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      승
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      패
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      세이브
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      홀드
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      이닝
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      탈삼진
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      피안타
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      피홈런
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      실점
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      자책점
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap border-r border-gray-200">
                      볼넷
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap">
                      사구
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {careerStats.map((stat, index) => (
                    <tr
                      key={stat.year}
                      className={`border-b border-gray-100 ${stat.year === "통산" ? "bg-blue-50" : ""}`}
                    >
                      <td
                        className={`py-4 px-2 font-bold text-sm sm:text-base border-r border-gray-200 ${stat.year === "통산" ? "text-blue-600" : "text-slate-800"}`}
                      >
                        {stat.year}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.era}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.games}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.wins}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.losses}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.saves}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.holds}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.innings}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.strikeouts}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.hitsAllowed}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.homerunsAllowed}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.runsAllowed}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.earnedRuns}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base border-r border-gray-200">
                        {stat.walks}
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-800 text-sm sm:text-base">{stat.hitByPitch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Yearly Trend Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-4">📊 년도별 기록 추이</h2>
            <div className="h-64 md:h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey="era"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }}
                    name="ERA"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }}
                    name="AVG"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-slate-600 font-medium">ERA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                <span className="text-slate-600 font-medium">AVG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const leagues = ["KBO", "MLB", "NPB"]

  const mlbMenus = ["순위", "팀 순위", "선수 목록", "경기 결과"]
  const kboMenus = ["KBO 순위", "선수 TOP 20", "선수 목록", "경기 결과"]
  const otherMenus = ["국제 대회", "아마추어 리그", "통계 분석", "뉴스"]

  const todayGamesOld = [
    {
      id: 1,
      homeTeam: "LG Twins",
      awayTeam: "Doosan Bears",
      homePitcher: "Kim",
      awayPitcher: "Lee",
      stadium: "Jamsil Stadium",
      weather: "맑음",
      homeScore: 7,
      awayScore: 4,
      status: "종료",
    },
    {
      id: 2,
      homeTeam: "Samsung Lions",
      awayTeam: "KIA Tigers",
      homePitcher: "Park",
      awayPitcher: "Choi",
      stadium: "Daegu Stadium",
      weather: "흐림",
      homeScore: 3,
      awayScore: 8,
      status: "종료",
    },
    {
      id: 3,
      homeTeam: "NC Dinos",
      awayTeam: "SSG Landers",
      homePitcher: "Jung",
      awayPitcher: "Moon",
      stadium: "Changwon Stadium",
      weather: "비",
      homeScore: 0,
      awayScore: 0,
      status: "예정",
    },
    {
      id: 4,
      homeTeam: "Hanwha Eagles",
      awayTeam: "Lotte Giants",
      homePitcher: "Yoon",
      awayPitcher: "Kim",
      stadium: "Daejeon Stadium",
      weather: "맑음",
      homeScore: 0,
      awayScore: 0,
      status: "예정",
    },
    {
      id: 5,
      homeTeam: "KT Wiz",
      awayTeam: "Kiwoom Heroes",
      homePitcher: "Son",
      awayPitcher: "Lee",
      stadium: "Suwon Stadium",
      weather: "흐림",
      homeScore: 0,
      awayScore: 0,
      status: "예정",
    },
  ]

  // Live KBO schedule from API (updates daily at KST midnight)
  const [todayGames, setTodayGames] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/kbo-schedule')
        if (!res.ok) return
        const data = await res.json()
        const games = Array.isArray(data?.games) ? data.games : []
        const mapped = games.map((g: any, idx: number) => ({
          id: idx + 1,
          homeTeam: g.homeTeam,
          awayTeam: g.awayTeam,
          stadium: g.stadium,
          status: g.status || '예정',
          homeScore: typeof g.homeScore === 'number' ? g.homeScore : 0,
          awayScore: typeof g.awayScore === 'number' ? g.awayScore : 0,
          homePitcher: '',
          awayPitcher: '',
          weather: '',
        }))
        if (!cancelled) setTodayGames(mapped)
      } catch {
        // ignore
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const mlbGames = [
    {
      id: 1,
      homeTeam: "San Francisco Giants",
      awayTeam: "Colorado Rockies",
      homePitcher: "Webb",
      awayPitcher: "Freeland",
      koreanPlayer: "김하성",
      playerPosition: "SS",
      stadium: "Oracle Park",
      weather: "맑음",
      homeScore: 8,
      awayScore: 3,
      status: "종료",
    },
    {
      id: 2,
      homeTeam: "Los Angeles Dodgers",
      awayTeam: "Arizona Diamondbacks",
      homePitcher: "Buehler",
      awayPitcher: "Kelly",
      koreanPlayer: "최지만",
      playerPosition: "1B",
      stadium: "Dodger Stadium",
      weather: "흐림",
      homeScore: 5,
      awayScore: 2,
      status: "종료",
    },
    {
      id: 3,
      homeTeam: "Atlanta Braves",
      awayTeam: "Philadelphia Phillies",
      homePitcher: "Fried",
      awayPitcher: "Nola",
      koreanPlayer: "박효준",
      playerPosition: "2B",
      stadium: "Truist Park",
      weather: "비",
      homeScore: 4,
      awayScore: 6,
      status: "예정",
    },
  ]

  const getPrevIndex = (index: number) => (index - 1 + leagues.length) % leagues.length
  const getNextIndex = (index: number) => (index + 1) % leagues.length

  const getCurrentMenus = () => {
    const selectedLeague = leagues[currentIndex]
    if (selectedLeague === "MLB") return mlbMenus
    if (selectedLeague === "KBO") return kboMenus
    return otherMenus
  }

  const handlePrev = () => {
    setCurrentIndex(getPrevIndex(currentIndex))
  }

  const handleNext = () => {
    setCurrentIndex(getNextIndex(currentIndex))
  }

  const prevIndex = getPrevIndex(currentIndex)
  const nextIndex = getNextIndex(currentIndex)
  const currentMenus = getCurrentMenus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 snap-y snap-mandatory overflow-y-scroll">
      <div className="snap-start">
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">BAIEYE</div>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/services"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
              >
                SERVICES
              </Link>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
                GALLERY
              </a>
              <Link
                href="/information"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
              >
                INFORMATION
              </Link>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
                LOGIN
              </a>
            </nav>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200/50">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link
                  href="/services"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 py-2 text-left"
                >
                  SERVICES
                </Link>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                >
                  GALLERY
                </a>
                <Link
                  href="/information"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                >
                  INFORMATION
                </Link>
                <Link
                  href="#"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                >
                  경기 결과
                </Link>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                >
                  LOGIN
                </a>
              </nav>
            </div>
          )}
        </header>

        <div className="py-8 sm:py-16 px-4">
          {/* ?먮옒 ??댄? ?됱긽?쇰줈 蹂듭썝 */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-center text-slate-900 tracking-tight">
            B.AIEYE
          </h1>
          {/* ?먮옒 ?쒕툕??댄? ?됱긽?쇰줈 蹂듭썝 */}
          <p className="text-center text-slate-600 mt-4 text-sm sm:text-base max-w-md mx-auto">
            야구 통계의 새로운 시각, 데이터로 보는 야구의 모든 것          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-8 mb-8 sm:mb-16">
          <div className="flex justify-center items-center">
            <div className="relative flex items-center justify-center w-full max-w-md sm:max-w-lg">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center justify-center flex-1 mx-4 sm:mx-8 h-16 relative overflow-hidden">
                {/* Left League (inactive) */}
                <div
                  className={`absolute left-0 flex justify-center items-center w-1/3 transition-all duration-500 ease-in-out transform ${currentIndex !== prevIndex ? "translate-x-0" : "translate-x-full"}`}
                >
                  <div className="text-sm sm:text-lg font-medium text-slate-400 opacity-60">{leagues[prevIndex]}</div>
                </div>

                {/* Current League (active) */}
                <div className="absolute inset-0 flex justify-center items-center transition-all duration-500 ease-in-out transform">
                  <div className="text-2xl sm:text-4xl font-bold text-slate-900">{leagues[currentIndex]}</div>
                </div>

                {/* Right League (inactive) */}
                <div
                  className={`absolute right-0 flex justify-center items-center w-1/3 transition-all duration-500 ease-in-out transform ${currentIndex !== nextIndex ? "translate-x-0" : "-translate-x-full"}`}
                >
                  <div className="text-sm sm:text-lg font-medium text-slate-400 opacity-60">{leagues[nextIndex]}</div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-8 pb-8">
          <div className="grid gap-3 sm:gap-4">
            {currentMenus.map((menu, index) => (
              <div
                key={`${leagues[currentIndex]}-${menu}-${currentIndex}`}
                className="bg-white/90 border border-gray-200/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "600ms",
                  animationFillMode: "both",
                }}
              >
                <Link
                  href={
                    leagues[currentIndex] === "KBO" && menu === "선수 목록"
                      ? "/players"
                      : leagues[currentIndex] === "KBO" && menu === "KBO 순위"
                        ? "/kbo-rankings"
                        : leagues[currentIndex] === "KBO" && menu === "선수 TOP 20"
                          ? "/top20"
                          : leagues[currentIndex] === "KBO" && index === 3
                            ? "/games"
                            : "#"
                  }
                  className="block w-full"
                >
                  <button className="w-full py-4 sm:py-6 px-4 sm:px-6 text-left font-semibold text-base sm:text-lg text-slate-900 hover:bg-slate-50/50 transition-all duration-300 flex justify-between items-center rounded-lg group">
                    <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-700">
                      {menu}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="snap-start min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16 w-full">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="border-l-4 border-slate-800 pl-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">BAIEYE 경기 정보</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">KBO</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {todayGames.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                    오늘 경기 일정이 없습니다.
                  </div>
                </div>
              ) : (
                todayGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="bg-slate-800 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {game.status === "종료" ? (
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-left">
                            <div className="font-semibold text-sm text-slate-300">Home Team</div>
                            <div className="font-bold">{game.homeTeam}</div>
                            <div className="text-xs text-slate-400">승</div>
                          </div>
                          <div className="text-4xl font-bold">{game.homeScore}</div>
                        </div>

                        <div className="text-center text-2xl font-bold text-slate-300 my-4">VS</div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="text-left">
                            <div className="font-semibold text-sm text-slate-300">Away Team</div>
                            <div className="font-bold">{game.awayTeam}</div>
                            <div className="text-xs text-slate-400">패</div>
                          </div>
                          <div className="text-4xl font-bold">{game.awayScore}</div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-600">
                          <div className="text-xs text-slate-400">
                            {game.stadium} {game.weather ? `· ${game.weather}` : ""}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <div className="font-semibold text-sm text-slate-300">Home Team</div>
                          <div className="font-bold text-lg">{game.homeTeam}</div>
                          {game.homePitcher && (
                            <div className="text-sm text-slate-400">선발투수: {game.homePitcher}</div>
                          )}
                        </div>

                        <div className="text-center text-2xl font-bold text-slate-300 my-4">VS</div>

                        <div className="mb-4">
                          <div className="font-semibold text-sm text-slate-300">Away Team</div>
                          <div className="font-bold text-lg">{game.awayTeam}</div>
                          {game.awayPitcher && (
                            <div className="text-sm text-slate-400">선발투수: {game.awayPitcher}</div>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-600">
                          <div className="text-xs text-slate-400">
                            {game.stadium} {game.weather ? `· ${game.weather}` : ""}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">MLB (한국 선수)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mlbGames.map((game, index) => (
                <div
                  key={game.id}
                  className="bg-slate-800 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {game.status === "종료" ? (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                          <div className="font-semibold text-sm text-slate-300">Home Team</div>
                          <div className="font-bold">{game.homeTeam}</div>
                          <div className="text-xs text-slate-400">승</div>
                        </div>
                        <div className="text-4xl font-bold">{game.homeScore}</div>
                      </div>

                      <div className="text-center text-2xl font-bold text-slate-300 my-4">VS</div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                          <div className="font-semibold text-sm text-slate-300">Away Team</div>
                          <div className="font-bold">{game.awayTeam}</div>
                          <div className="text-xs text-slate-400">패</div>
                        </div>
                        <div className="text-4xl font-bold">{game.awayScore}</div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-600">
                        <div className="text-xs text-slate-400 mb-2">
                          {game.stadium} {game.weather ? `· ${game.weather}` : ""}
                        </div>
                        <div className="text-sm text-blue-400 font-semibold">
                          한국 선수: {game.koreanPlayer} ({game.playerPosition})
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="font-semibold text-sm text-slate-300">Home Team</div>
                        <div className="font-bold text-lg">{game.homeTeam}</div>
                        <div className="text-sm text-slate-400">선발투수: {game.homePitcher}</div>
                      </div>

                      <div className="text-center text-2xl font-bold text-slate-300 my-4">VS</div>

                      <div className="mb-4">
                        <div className="font-semibold text-sm text-slate-300">Away Team</div>
                        <div className="font-bold text-lg">{game.awayTeam}</div>
                        <div className="text-sm text-slate-400">선발투수: {game.awayPitcher}</div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-600">
                        <div className="text-xs text-slate-400 mb-2">
                          {game.stadium} {game.weather ? `· ${game.weather}` : ""}
                        </div>
                        <div className="text-sm text-blue-400 font-semibold">
                          한국 선수: {game.koreanPlayer} ({game.playerPosition})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 문의하기 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-14 h-14 bg-slate-800 hover:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}





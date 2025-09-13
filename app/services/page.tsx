"use client"

import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-900">
            BAIEYE
          </Link>
          <nav className="flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              홈
            </Link>
            <Link href="/services" className="text-slate-900 font-medium">
              서비스
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-4">우리의 서비스</h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            데이터를 더 쉽고 직관적으로 만들어갑니다
          </p>
        </div>

        {/* Current Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Game Data Analysis Reports */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v8H7V7zm4 0h2v8h-2V7zm4 2h2v6h-2V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">경기 데이터</h3>
            <h3 className="text-xl font-bold text-slate-900 mb-4">분석 리포트</h3>
            <p className="text-slate-600 leading-relaxed">핵심 통계를 요약한 맞춤형 리포트</p>
          </div>

          {/* Player Performance Tracking */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l3-8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">선수 성과</h3>
            <h3 className="text-xl font-bold text-slate-900 mb-4">추적 시스템</h3>
            <p className="text-slate-600 leading-relaxed">기록, 트렌드, 성장 지표 추적</p>
          </div>

          {/* Fan-Friendly Content */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">팬 친화적</h3>
            <h3 className="text-xl font-bold text-slate-900 mb-4">콘텐츠</h3>
            <p className="text-slate-600 leading-relaxed">인포그래픽과 인터랙티브 시각화</p>
          </div>
        </div>

        {/* Upcoming Services */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">예정된 서비스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Real-time Game Data Platform */}
            <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">실시간 경기</h3>
                <h3 className="text-xl font-bold text-slate-900 mb-3">데이터 플랫폼</h3>
                <p className="text-slate-600 leading-relaxed">경기 중 핵심 지표를 실시간으로 제공하는 대시보드</p>
              </div>
            </div>

            {/* Predictive Modeling Services */}
            <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">예측 모델링</h3>
                <h3 className="text-xl font-bold text-slate-900 mb-3">서비스</h3>
                <p className="text-slate-600 leading-relaxed">머신러닝 기반 경기 결과 예측</p>
              </div>
            </div>
          </div>
        </div>

        {/* More Sports Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">더 많은 스포츠. 더 깊은 인사이트.</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            축구, 야구, 농구, e스포츠 등 다양한 스포츠로 확장 예정
          </p>
          <div className="flex justify-center space-x-6">
            {/* Soccer Icon */}
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            {/* Basketball Icon */}
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.09 11h4.86c-.16-1.61-.71-3.11-1.54-4.4C18.68 7.43 17.92 9.13 17.09 11zM6.91 11C6.08 9.13 5.32 7.43 3.59 6.6c-.83 1.29-1.38 2.79-1.54 4.4H6.91zM15.07 11c.53-1.33 1.16-2.68 1.85-3.65C16.17 6.95 15.44 6.6 14.66 6.35c-.22.72-.4 1.46-.59 2.19C14.31 9.59 14.67 10.28 15.07 11zM8.93 11c.4-.72.76-1.41 1-2.46-.19-.73-.37-1.47-.59-2.19-.78.25-1.51.6-2.26 1c.69.97 1.32 2.32 1.85 3.65zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </div>
            {/* Esports Icon */}
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19h0c0.68 0 1.32-0.27 1.8-0.75L9 16h6l2.26 2.25c0.48 0.48 1.12 0.75 1.8 0.75h0C20.61 19 21.8 17.63 21.58 16.09z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

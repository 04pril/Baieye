export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl sm:text-2xl font-bold text-slate-900">BAIEYE</div>
          <nav className="flex space-x-8">
            <a href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              HOME
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-4">B.AIEYE</h1>
          <p className="text-xl text-slate-600 font-medium">스포츠 데이터를 더 쉽게, 더 정확하게</p>
        </div>

        {/* About Section */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 border-l-4 border-slate-800 pl-4">ABOUT</h2>

          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
            <p className="text-xl font-medium text-slate-900 mb-6">BAIEYE(베이아이), 보이지 않는 것을 보는 눈</p>

            <p>
              스포츠는 언제나 우리를 열광하게 합니다. 빠른 스피드, 치열한 경쟁, 극적인 순간들... 하지만 그 안에는 누구도
              쉽게 보지 못하는 숨은 움직임과 데이터의 세계가 있습니다.
            </p>

            <p>
              우리는 그 세계가 단순한 숫자 이상의 의미를 가진다고 믿었습니다. 한 선수의 작은 움직임이 승부를 바꾸고,
              팀의 보이지 않는 패턴이 경기의 흐름을 좌우합니다.
            </p>

            <p>
              그럼에도 많은 것들이 여전히 보이지 않은 채 남아 있었습니다. 우리는 그 순간들을 세상 밖으로 꺼내고
              싶었습니다.
            </p>

            <p>
              그래서 저희는 BAIEYE(베이아이)를 만들었습니다. 데이터와 기술을 통해 선수에게는 성장의 길을, 코치에게는
              전략의 무기를, 팬에게는 더 깊은 몰입을 선물하기 위해.
            </p>

            <p className="text-xl font-semibold text-slate-900 pt-4">
              BAIEYE는 단순히 기록하는 눈이 아닙니다. 스포츠 속에 숨어 있던 이야기를 발견하고, 그 이야기를 사람들에게
              닿게 하는 눈입니다.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Data Analysis */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">데이터 분석</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">정밀한 데이터 분석을 통해 경기 변화를 파악합니다.</p>
          </div>

          {/* Insights */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">인사이트</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">대중과 전문가 모두에게 유용한 정보로 활용됩니다.</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-slate-800 rounded-2xl shadow-lg p-8 mt-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">우리의 미션</h3>
          <p className="text-lg leading-relaxed text-slate-300">
            BAIEYE는 스포츠 데이터 분석을 통해 참여자의 경기력 향상과 중요한 정보 기반의 최상의 서비스를 모두에게 쉽고
            명확하게 스포츠 데이터를 전달합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            재무 데이터 분석
          </h1>
          <p className="text-xl text-gray-600">
            누구나 쉽게 이해할 수 있는 회사 재무 정보 시각화 서비스
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <p className="text-gray-700 text-lg mb-6">
            분석하고 싶은 회사를 검색해보세요
          </p>
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              쉬운 시각화
            </h3>
            <p className="text-gray-600">
              복잡한 재무 데이터를 보기 좋은 차트로 표현합니다
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI 분석
            </h3>
            <p className="text-gray-600">
              Gemini AI가 재무 데이터를 쉽게 설명해드립니다
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              실시간 데이터
            </h3>
            <p className="text-gray-600">
              공식 재무제표를 바탕으로 최신 정보를 제공합니다
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

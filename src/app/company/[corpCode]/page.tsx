'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FinancialData, ChartData, AIAnalysisResponse, FinancialItem } from '@/types/financial';
import FinancialCharts from '@/components/FinancialCharts';
import AIAnalysis from '@/components/AIAnalysis';

export default function CompanyDashboard() {
  const params = useParams();
  const router = useRouter();
  const corpCode = params.corpCode as string;

  const [companyName, setCompanyName] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState<string[]>([]);
  const [fsDiv, setFsDiv] = useState<'CFS' | 'OFS'>('CFS');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchCorpName();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchFinancialData();
    }
  }, [selectedYear, fsDiv]);

  const fetchCorpName = async () => {
    try {
      const response = await fetch('/api/search?q=' + corpCode);
      const data = await response.json();
      if (data.list && data.list.length > 0) {
        setCompanyName(data.list[0].n);
      }
    } catch (error) {
      console.error('Error fetching company name:', error);
    }
  };

  const fetchFinancialData = async () => {
    setLoading(true);
    setAiAnalysis(null);
    try {
      const allYears = [
        (parseInt(selectedYear) - 2).toString(),
        (parseInt(selectedYear) - 1).toString(),
        selectedYear,
      ];

      const allData: ChartData[] = [];
      let allFinancialItems: FinancialItem[] = [];

      for (const year of allYears) {
        const response = await fetch(
          `/api/financial?corp_code=${corpCode}&bsns_year=${year}&reprt_code=11011`
        );
        const data: FinancialData = await response.json();

        if (data.list && Array.isArray(data.list)) {
          allFinancialItems = [...allFinancialItems, ...data.list];
          const chartItem = parseFinancialData(data.list, year);
          allData.push(chartItem);
        }
      }

      setChartData(allData);
      setYears(allYears);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseFinancialData = (items: FinancialItem[], year: string): ChartData => {
    const data: ChartData = { year };

    items.forEach((item) => {
      const amount = parseInt(item.thstrm_amount?.replace(/,/g, '') || '0');

      if (item.sj_div === 'BS') {
        if (item.account_nm === '유동자산') data.currentAssets = amount;
        if (item.account_nm === '비유동자산') data.nonCurrentAssets = amount;
        if (item.account_nm === '유동부채') data.currentLiabilities = amount;
        if (item.account_nm === '비유동부채') data.nonCurrentLiabilities = amount;
        if (item.account_nm === '자본총계') data.equity = amount;
      }

      if (item.sj_div === 'IS') {
        if (item.account_nm === '매출액') data.revenue = amount;
        if (item.account_nm === '영업이익') data.operatingProfit = amount;
        if (item.account_nm === '당기순이익(손실)') data.netIncome = amount;
      }
    });

    return data;
  };

  const handleAnalyze = async () => {
    if (!chartData.length) return;

    setAiLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: chartData,
          companyName,
          year: selectedYear,
          fsDiv,
        }),
      });

      const result = await response.json();
      setAiAnalysis(result.data);
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setAiLoading(false);
    }
  };

  if (!corpCode) {
    return <div className="text-center py-8">회사 정보를 찾을 수 없습니다</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            ← 돌아가기
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{companyName}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                사업연도
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString()).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                재무제표 구분
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFsDiv('CFS')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                    fsDiv === 'CFS'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  연결재무제표
                </button>
                <button
                  onClick={() => setFsDiv('OFS')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                    fsDiv === 'OFS'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  별도재무제표
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchFinancialData}
                disabled={!selectedYear || loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {loading ? '조회 중...' : '조회'}
              </button>
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <>
            <div className="mb-8">
              <FinancialCharts data={chartData} companyName={companyName} />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">AI 분석</h2>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  재무 데이터 조회 완료
                </span>
              </div>
              <AIAnalysis
                companyName={companyName}
                year={selectedYear}
                loading={aiLoading}
                analysis={aiAnalysis}
                onAnalyze={handleAnalyze}
              />
            </div>
          </>
        )}

        {selectedYear && chartData.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              조회할 수 있는 데이터가 없습니다. 다른 연도를 시도해주세요.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

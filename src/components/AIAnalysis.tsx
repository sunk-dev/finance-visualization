'use client';

import { useState } from 'react';
import { AIAnalysisResponse } from '@/types/financial';

interface AIAnalysisProps {
  companyName: string;
  year: string;
  loading: boolean;
  analysis: AIAnalysisResponse | null;
  onAnalyze: () => void;
}

export default function AIAnalysis({
  companyName,
  year,
  loading,
  analysis,
  onAnalyze,
}: AIAnalysisProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-2xl p-8 border border-indigo-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            투자자 AI 분석
          </h2>
          <p className="text-gray-600">
            {companyName} {year}년 재무 데이터를 투자 관점에서 분석합니다
          </p>
        </div>
      </div>

      {!analysis ? (
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
              <span>AI 분석 진행 중...</span>
            </>
          ) : (
            <>
              <span>💡</span>
              <span>AI 분석 시작 (투자자 관점)</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-6">
          {/* 건강도 카드 */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-indigo-500 shadow-md">
            <h3 className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
              <span>📊</span>
              회사 재정 건강도
            </h3>
            <p className="text-xl text-gray-900 font-semibold leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* 핵심 포인트 */}
          {analysis.keyInsights.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <span>💡</span>
                투자자가 알아야 할 핵심 포인트
              </h3>
              <div className="space-y-3">
                {analysis.keyInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                  >
                    <span className="text-indigo-600 font-bold text-lg flex-shrink-0 w-8">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 상세 분석 */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-lg mb-3 transition"
            >
              <span className="text-2xl">{expanded ? '📈' : '📉'}</span>
              {expanded ? '상세 분석 접기' : '상세 분석 보기'}
            </button>
            {expanded && (
              <div className="bg-white rounded-lg p-6 text-gray-700 leading-relaxed border border-indigo-100 shadow-md whitespace-pre-wrap">
                {analysis.analysis}
              </div>
            )}
          </div>

          {/* 다시 분석 버튼 */}
          <button
            onClick={onAnalyze}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            🔄 재분석
          </button>
        </div>
      )}
    </div>
  );
}

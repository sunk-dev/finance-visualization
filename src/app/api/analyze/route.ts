import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysisRequest, AIAnalysisResponse, ChartData } from '@/types/financial';

export async function POST(request: NextRequest) {
  try {
    const body: AIAnalysisRequest = await request.json();
    const { financialData, companyName, year } = body;

    if (!financialData || !companyName || !year) {
      return NextResponse.json(
        { error: '필수 파라미터가 없습니다' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // API 키가 없거나 유효하지 않으면 데모 분석 반환
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log('Using demo analysis mode (no valid API key)');
      const analysis = generateDemoAnalysis(companyName, financialData, year);
      return NextResponse.json({
        status: '000',
        message: '정상',
        data: analysis,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const financialSummary = summarizeFinancialDataForInvestor(financialData);
      const prompt = `${companyName} ${year}년 재무분석. 투자자 관점에서 한국어로 간단히 분석:

${financialSummary}

응답 형식:
📊건강도: 좋음/보통/주의 + 한 문장 설명
💡포인트: 3가지 핵심 (각 1줄)
📈분석: 매출·수익성·재무구조 (각 1줄)
💰결론: 투자 권고 (2줄)

금융용어 최소화, 쉬운 표현 사용.`;

      const result = await model.generateContent(prompt);
      const responseText =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        '분석을 생성할 수 없었습니다';

      const analysis = parseInvestorAnalysis(responseText);

      return NextResponse.json({
        status: '000',
        message: '정상',
        data: analysis,
      });
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError?.message);
      
      // API 할당량 초과 또는 다른 오류 시 데모 분석 반환
      const analysis = generateDemoAnalysis(companyName, financialData, year);
      return NextResponse.json({
        status: '000',
        message: '데모 분석',
        data: analysis,
      });
    }
  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

function generateDemoAnalysis(companyName: string, data: ChartData[], year: string): AIAnalysisResponse {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      summary: '데이터가 부족하여 분석할 수 없습니다.',
      keyInsights: [],
      analysis: '재무 데이터가 필요합니다.',
    };
  }

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;

  const totalAssets = (latest.currentAssets || 0) + (latest.nonCurrentAssets || 0);
  const totalLiabilities = (latest.currentLiabilities || 0) + (latest.nonCurrentLiabilities || 0);
  const equity = latest.equity || 0;

  // 재무 지표 계산
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const profitMargin = latest.revenue && latest.netIncome ? ((latest.netIncome / latest.revenue) * 100) : 0;
  const revenueGrowth = previous && previous.revenue
    ? (((latest.revenue || 0) - previous.revenue) / previous.revenue) * 100
    : 0;

  // 건강도 판정
  let healthStatus = '보통';
  if (debtRatio < 40 && profitMargin > 10 && revenueGrowth > 5) {
    healthStatus = '좋음';
  } else if (debtRatio > 60 || profitMargin < 5) {
    healthStatus = '주의';
  }

  const summary =
    healthStatus === '좋음'
      ? `${companyName}는 안정적인 재무 구조와 꾸준한 성장세를 보이고 있어 투자 매력도가 높습니다.`
      : healthStatus === '주의'
      ? `${companyName}는 부채 수준이나 수익성에서 개선이 필요한 상황입니다. 주의깊은 관찰이 필요합니다.`
      : `${companyName}는 일반적인 재무 수준을 유지하고 있습니다. 시장 환경과 함께 모니터링이 필요합니다.`;

  const formatNum = (n: number) => {
    if (n >= 1000000000000) return `${(n / 1000000000000).toFixed(1)}조`;
    if (n >= 100000000) return `${(n / 100000000).toFixed(0)}억`;
    return `${(n / 100000000).toFixed(1)}억`;
  };

  const keyInsights = [
    `부채비율 ${debtRatio.toFixed(1)}% - ${debtRatio < 50 ? '건강한' : '높은'} 부채 수준`,
    `순이익률 ${profitMargin.toFixed(1)}% - ${profitMargin > 10 ? '우수한' : profitMargin > 5 ? '양호한' : '낮은'} 수익성`,
    `최근 1년 매출성장 ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% - ${revenueGrowth > 0 ? '성장' : '감소'} 추세`,
  ];

  const analysisText = `
📈 재무 성과:
- 매출액: ${formatNum(latest.revenue || 0)} (전년대비 ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%)
- 순이익: ${formatNum(latest.netIncome || 0)}
- 총자산: ${formatNum(totalAssets)}

💰 투자 판단:
${healthStatus === '좋음' ? '안정적인 현금 흐름과 개선되는 수익성을 고려할 때 장기 투자에 긍정적입니다. 정기적인 성과 추적을 권고합니다.' : healthStatus === '주의' ? '현재 재무 지표에서 개선 신호를 기다리며 추이 관찰을 권고합니다. 산업 평균과의 비교 분석이 필요합니다.' : '일정 수준의 재무 안정성을 유지하고 있으나, 경쟁 환경 변화에 따른 영향을 모니터링하는 것이 중요합니다.'}
  `;

  return {
    summary,
    keyInsights,
    analysis: analysisText.trim(),
  };
}

function summarizeFinancialDataForInvestor(data: ChartData[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '데이터 없음';
  }

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;

  const formatNum = (n: number) => {
    if (n >= 1000000000000) return `${(n / 1000000000000).toFixed(1)}조`;
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
    return `${n}`;
  };

  const calculateGrowth = (current: number, prev: number | undefined) => {
    if (!prev || prev === 0) return '0%';
    return `${(((current - prev) / prev) * 100).toFixed(1)}%`;
  };

  const totalAssets = (latest.currentAssets || 0) + (latest.nonCurrentAssets || 0);
  const totalLiabilities =
    (latest.currentLiabilities || 0) + (latest.nonCurrentLiabilities || 0);

  let summary = `${latest.year}년:
- 매출: ${formatNum(latest.revenue || 0)}`;

  if (previous) {
    summary += ` (전년비 ${calculateGrowth(latest.revenue || 0, previous.revenue)})`;
  }

  summary += `
- 순이익: ${formatNum(latest.netIncome || 0)}`;

  if (latest.revenue) {
    summary += ` (이익률 ${((((latest.netIncome || 0) / latest.revenue) * 100).toFixed(1))}%)`;
  }

  summary += `
- 총자산: ${formatNum(totalAssets)}
- 자본: ${formatNum(latest.equity || 0)}`;

  if (totalAssets > 0) {
    summary += `
- 부채비: ${((totalLiabilities / totalAssets) * 100).toFixed(0)}%`;
  }

  if (data.length >= 2) {
    summary += `
- 3년 매출성장: ${calculateGrowth(latest.revenue || 0, data[0].revenue)}
- 3년 순이익성장: ${calculateGrowth(latest.netIncome || 0, data[0].netIncome)}`;
  }

  return summary;
}

function parseInvestorAnalysis(response: string): AIAnalysisResponse {
  const lines = response.split('\n');
  
  let summary = '';
  let keyInsights: string[] = [];
  let analysis = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes('📊') && !summary) {
      summary = trimmed.replace(/📊|건강도|:/g, '').trim();
      if (!summary) {
        summary = lines[lines.indexOf(line) + 1]?.trim() || '';
      }
    } else if (trimmed.includes('💡')) {
      const idx = lines.indexOf(line);
      for (let i = idx + 1; i < lines.length && keyInsights.length < 3; i++) {
        const point = lines[i]?.trim()?.replace(/^[-•*\d.]\s*/, '');
        if (point && point.length > 5 && !point.includes('�')) {
          keyInsights.push(point);
        }
      }
    } else if (trimmed.includes('📈') || trimmed.includes('💰')) {
      if (trimmed.includes('📈')) {
        analysis += trimmed.replace(/📈|분석|:/g, '').trim() + ' ';
      } else {
        analysis += trimmed.replace(/💰|결론|:/g, '').trim() + ' ';
      }
    }
  }

  if (!summary) {
    summary = response.split('\n')[0] || '투자자 관점의 재무 분석을 완료했습니다.';
  }

  if (keyInsights.length === 0) {
    keyInsights = response
      .split('\n')
      .filter((line) => line.trim().length > 10 && !line.includes('�'))
      .slice(1, 4)
      .map((line) => line.trim().replace(/^[-•*\d.]\s*/, ''));
  }

  if (!analysis) {
    analysis = response
      .split('\n')
      .slice(Math.max(0, lines.length - 5))
      .join(' ')
      .trim();
  }

  return {
    summary: summary || '재무 분석이 완료되었습니다.',
    keyInsights: keyInsights.filter((x) => x.length > 5).slice(0, 3),
    analysis: analysis.trim() || response,
  };
}

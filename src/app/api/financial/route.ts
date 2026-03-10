import { NextRequest, NextResponse } from 'next/server';
import { FinancialData } from '@/types/financial';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const corpCode = searchParams.get('corp_code');
    const bsnsYear = searchParams.get('bsns_year');
    const reprtCode = searchParams.get('reprt_code') || '11011';

    if (!corpCode || !bsnsYear) {
      return NextResponse.json(
        { error: 'corp_code와 bsns_year는 필수입니다' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENDART_API_KEY;
    if (!apiKey) {
      console.error('OPENDART_API_KEY is not set');
      return NextResponse.json(
        { error: 'API 설정 오류' },
        { status: 500 }
      );
    }

    const openDartUrl = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcnt.json');
    openDartUrl.searchParams.append('crtfc_key', apiKey);
    openDartUrl.searchParams.append('corp_code', corpCode);
    openDartUrl.searchParams.append('bsns_year', bsnsYear);
    openDartUrl.searchParams.append('reprt_code', reprtCode);
    openDartUrl.searchParams.append('fs_div', 'CFS');

    const response = await fetch(openDartUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    if (!response.ok) {
      console.error('OpenDART API Error:', response.statusText);
      return NextResponse.json(
        { error: 'OpenDART API 요청 실패' },
        { status: 500 }
      );
    }

    const data: FinancialData = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Financial API Error:', error);
    return NextResponse.json(
      { error: '재무 데이터 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

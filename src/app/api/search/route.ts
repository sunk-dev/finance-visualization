import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { CorpInfo } from '@/types/financial';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q')?.toLowerCase();

    if (!q || q.length < 1) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요' },
        { status: 400 }
      );
    }

    const corpDataPath = path.join(process.cwd(), 'public', 'corp_data.json');
    const corpDataContent = fs.readFileSync(corpDataPath, 'utf-8');
    const corpData: CorpInfo[] = JSON.parse(corpDataContent);

    const results = corpData
      .filter((corp) => corp.n.toLowerCase().includes(q) || corp.c.includes(q))
      .slice(0, 20);

    return NextResponse.json({
      status: '000',
      message: '정상',
      list: results,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

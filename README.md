# 재무 데이터 시각화 분석 서비스

누구나 쉽게 이해할 수 있는 회사 재무 정보 시각화 및 AI 분석 서비스입니다.

## 주요 기능

### 1. 회사 검색
- 회사명 또는 종목코드로 검색 (3,864개 기업 데이터)
- 실시간 자동완성 검색
- corp.xml 데이터를 기반으로 빠른 검색

### 2. 재무 시각화
- **매출 · 이익 추이**: 연도별 매출액, 영업이익, 당기순이익 비교 (막대 그래프)
- **자산 구성**: 유동자산 vs 비유동자산 (누적 막대 그래프)
- **부채 vs 자본**: 재무 구조 비율 (파이 차트)
- **수익성 지표**: 영업이익률, 순이익률 추이 (라인 차트)

### 3. AI 분석 (Gemini 2.0-flash)
- OpenDART 재무 데이터를 기반으로 자동 분석
- 초등학생도 이해할 수 있는 쉬운 설명
- 핵심 인사이트 제시
- 상세 분석 제공

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **차트**: Recharts
- **AI**: Google Generative AI (Gemini 2.0-flash)
- **데이터**: OpenDART API, corp.xml
- **배포**: Vercel 최적화

## 프로젝트 구조

```
finance/
├── .env.example                # 환경변수 템플릿
├── .env.local                  # 환경변수 (gitignore)
├── .gitignore
├── public/
│   └── corp_data.json          # corp.xml 변환본 (빌드 시 생성)
├── scripts/
│   └── parse-corp-xml.ts       # XML 파싱 스크립트
├── src/
│   ├── app/
│   │   ├── globals.css         # 전역 스타일
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 메인 검색 페이지
│   │   ├── company/
│   │   │   └── [corpCode]/
│   │   │       └── page.tsx    # 재무 대시보드
│   │   └── api/
│   │       ├── search/
│   │       │   └── route.ts    # 회사 검색 API
│   │       ├── financial/
│   │       │   └── route.ts    # OpenDART 프록시 API
│   │       └── analyze/
│   │           └── route.ts    # AI 분석 API
│   ├── components/
│   │   ├── SearchBar.tsx       # 검색 바 컴포넌트
│   │   ├── FinancialCharts.tsx # 차트 모음 컴포넌트
│   │   └── AIAnalysis.tsx      # AI 분석 카드 컴포넌트
│   └── types/
│       └── financial.ts        # TypeScript 타입 정의
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일 생성 (`.env.example` 참고):

```
OPENDART_API_KEY=your_opendart_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**API 키 발급:**
- OpenDART API: https://opendart.fss.or.kr/ (무료)
- Gemini API: https://ai.google.dev/

### 3. 개발 서버 실행

```bash
npm run dev
```

- 메인 페이지: http://localhost:3000
- API 테스트: http://localhost:3000/api/search?q=삼성

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## API 명세

### 회사 검색 API
```
GET /api/search?q={회사명}
```
- 반환: 매칭되는 회사 목록 (최대 20개)

### 재무 데이터 API
```
GET /api/financial?corp_code={}&bsns_year={}&reprt_code={}
```
- corp_code: 회사 코드
- bsns_year: 사업연도 (예: 2024)
- reprt_code: 11011(연간), 11012(반기), 11013(1분기), 11014(3분기)

### AI 분석 API
```
POST /api/analyze
```
- body: `{ financialData, companyName, year, fsDiv }`
- 반환: AI 분석 결과 (요약, 핵심포인트, 상세분석)

## 주요 특징

### 보안
- API 키는 서버측에서만 관리 (클라이언트 노출 없음)
- 환경변수 기반 설정
- 배포 시 예외 처리

### 성능
- corp.xml을 빌드 시 JSON으로 변환 (검색 성능 향상)
- Next.js API Routes로 CORS 우회
- Vercel 배포 최적화

### UX
- 실시간 자동완성 검색
- 반응형 디자인
- 직관적인 차트 시각화
- 쉬운 AI 분석 설명

## Vercel 배포

### 1. 프로젝트 연결
```bash
npx vercel
```

### 2. 환경변수 설정
Vercel 대시보드에서 다음 환경변수 추가:
- `OPENDART_API_KEY`
- `GEMINI_API_KEY`

### 3. 배포
자동으로 git push 시 배포됩니다.

## 데이터 출처

- **회사 정보**: corp.xml (금융감독원)
- **재무 데이터**: OpenDART API (단일회사 주요계정)
- **AI 분석**: Google Generative AI (Gemini 2.0-flash)

## 주의사항

⚠️ **데모 모드에서는 실제 API 호출이 일어나지 않습니다**
- 반드시 유효한 API 키 설정 필요
- OpenDART는 한국 주식회사만 지원
- Gemini API는 월 5000 요청 무료

## 라이센스

MIT

## 지원

문제 발생 시:
1. `.env.local` 파일의 API 키 확인
2. 네트워크 연결 확인
3. 브라우저 콘솔에서 오류 메시지 확인

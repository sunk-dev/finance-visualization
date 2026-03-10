# Vercel 배포 가이드

## 📦 GitHub 저장소

**저장소 URL**: https://github.com/sunk-dev/finance-visualization  
**상태**: Public (공개)  
**브랜치**: master

### ✅ 업로드된 파일
- ✓ 모든 소스 코드
- ✓ 설정 파일 (next.config.js, tsconfig.json 등)
- ✓ 문서 (README.md, IMPROVEMENTS.md)
- ✗ .env.local (API 키 - 제외됨)

---

## 🚀 Vercel 배포 단계

### 1단계: Vercel에 로그인
1. https://vercel.com 접속
2. GitHub 계정으로 로그인

### 2단계: 프로젝트 import
1. "New Project" 클릭
2. GitHub 저장소 선택: `sunk-dev/finance-visualization`
3. Import 클릭

### 3단계: 환경변수 설정 ⚠️ 중요
Vercel 대시보드에서 **Environment Variables** 섹션에 다음 추가:

```
OPENDART_API_KEY=eca95e623accc1f55138275ebb9c706bf785105b
GEMINI_API_KEY=AIzaSyDIVaZb6yD7GRkqBTLRYDPdNtPthLJo49A
```

**환경변수 추가 방법:**
1. Project Settings → Environment Variables
2. 각 변수 입력
3. Production, Preview, Development 모두 선택
4. Save 클릭

### 4단계: 배포
1. "Deploy" 클릭
2. 배포 시작 (약 3-5분 소요)
3. 배포 완료 후 URL 확인

---

## 📝 배포 후 확인사항

### 필수 체크리스트
- [ ] Vercel 배포 성공 (상태: Ready)
- [ ] 환경변수 모두 설정됨
- [ ] 메인 페이지 로딩 확인 (/)
- [ ] 회사 검색 정상 작동
- [ ] 재무 데이터 조회 정상 작동
- [ ] AI 분석 버튼 정상 작동

### 배포 URL 형식
```
https://finance-visualization-<random>.vercel.app
```

---

## 🔒 API 키 보안

### ✅ 올바른 방법
```bash
# Vercel에서만 환경변수 설정
# .env.local은 gitignore 처리됨
# GitHub에는 API 키 업로드 안 됨
```

### ❌ 하면 안 되는 것
```bash
# 절대 금지: GitHub에 .env.local 커밋
git add .env.local  # ❌ 금지!

# 절대 금지: 코드에 API 키 하드코딩
const API_KEY = "your-secret-key"  # ❌ 금지!
```

---

## 🛠️ 문제 해결

### 배포 실패 시
1. Vercel 빌드 로그 확인
2. 환경변수 설정 재확인
3. 로컬에서 `npm run build` 성공 확인

### 런타임 오류 시
1. Vercel 함수 로그 확인
2. 환경변수 설정 확인
3. API 키 유효성 확인

---

## 📊 배포 후 모니터링

### Vercel 대시보드에서 확인
- **Deployments**: 배포 이력 및 상태
- **Analytics**: 사용자 방문, 성능 지표
- **Functions**: API 함수 호출 로그
- **Environment Variables**: 설정된 변수 확인

### 주요 메트릭
- **Build Time**: 약 20-30초
- **First Load**: 약 2-3초
- **API 응답**: 약 1-10초 (Gemini 분석 포함)

---

## 🔄 이후 업데이트

### 코드 수정 후 배포
```bash
# 1. 로컬에서 수정
# 2. 테스트 완료
git add .
git commit -m "Update message"
git push origin master
# 3. Vercel 자동 배포 (약 3-5분)
```

### 환경변수 업데이트
1. Vercel 대시보드 → Settings → Environment Variables
2. 변수 수정
3. 자동으로 새 배포 트리거됨

---

## 📞 지원

### 문제 발생 시 확인 사항
1. GitHub 저장소 상태: https://github.com/sunk-dev/finance-visualization
2. Vercel 빌드 로그
3. 브라우저 개발자 도구 (F12)
4. API 할당량 확인

---

## 📋 파일 구조 확인

### GitHub에 업로드된 핵심 파일
```
finance-visualization/
├── .env.example          # API 키 템플릿 (공개)
├── .gitignore            # .env.local 제외 설정
├── README.md             # 프로젝트 소개
├── IMPROVEMENTS.md       # 개선 사항 기록
├── package.json          # 의존성 정의
├── tsconfig.json         # TypeScript 설정
├── next.config.js        # Next.js 설정
├── tailwind.config.ts    # Tailwind 설정
├── src/                  # 소스 코드
└── public/               # 정적 파일
```

### GitHub에 업로드되지 않은 파일 (.gitignore)
```
.env.local               # ✗ 개인 API 키 (비밀)
node_modules/            # ✗ 의존성 패키지
.next/                   # ✗ 빌드 산출물
dist/                    # ✗ 배포 파일
```

---

**배포 준비 완료! 🎉 이제 Vercel에서 배포하면 됩니다.**

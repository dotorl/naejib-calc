# 내집계산기 (NaejibCalc)

주택 구매자를 위한 자금조달계획서, 대출이자계산기, 증여세계산기를 제공하는 통합 금융 계산 서비스입니다.

## 프로젝트 개요

내집계산기는 주택 구매 시 필요한 다양한 금융 계산을 하나의 플랫폼에서 수행할 수 있도록 도와주는 서비스입니다.

### 핵심 가치

1. **통합 계산**: 여러 계산기를 오가며 작업할 필요 없이 한 곳에서 모든 계산 수행
2. **데이터 동기화**: 자금조달계획서와 대출이자계산기 간 금액 자동 동기화
3. **정확한 계산**: 한국 금융 시스템에 맞춘 정확한 이자 계산 및 증여세 산정
4. **사용자 친화적**: 직관적인 UI와 반응형 디자인으로 모바일/데스크톱 모두 지원

## 주요 기능

### 1. 자금조달계획서 (약식)
- 주택 구매를 위한 자금 출처 정리
- 자기자금, 금융기관 대출, 부모님 차용 구분 관리
- 증여세 자동 계산 (누진세율 적용)
- 대출이자계산기와 양방향 데이터 동기화

### 2. 대출이자계산기
- 은행 대출과 부모님 차용 분리 계산
- 3가지 상환 방식 지원: 원리금균등, 원금균등, 만기일시
- 부모님 차용 시 증여세 회피를 위한 최적 이자율 자동 산출
- 월별 상환 스케줄 테이블 제공

### 3. 증여세계산기
- 증여재산 평가액 입력
- 5단계 누진세율 자동 계산
- 신고세액공제 적용 옵션

### 4. 예적금계산기 (향후 고도화 예정)
- 예금/적금 탭 분리
- 단리/월복리 선택
- 세금우대, 일반과세, 비과세 구분

## 기술 스택

- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x + SCSS
- **State Management**: Zustand 4.x + persist middleware
- **UI Components**: Lucide React, react-hot-toast

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
npm run build
npm start
```

### 4. 코드 포맷팅

```bash
npm run format        # Prettier 자동 포맷팅
npm run format:check  # 포맷팅 확인
```

## 상세 문서

각 기능과 페이지에 대한 상세한 설명은 `.claude/docs/` 폴더에서 확인하실 수 있습니다.
이 위치에 있으면 Claude가 세션이 끊겨도 자동으로 프로젝트 컨텍스트로 인식합니다.

### 📚 문서 목록

- **[프로젝트 전체 개요](.claude/docs/project-overview.md)** - 프로젝트 구조와 핵심 가치
- **[자금조달계획서](.claude/docs/funding-plan.md)** - 자금 출처 정리 및 증여세 계산
- **[대출이자계산기](.claude/docs/loan-calculator.md)** - 이자 계산 및 최적 이자율 산출
- **[증여세계산기](.claude/docs/gift-tax-calculator.md)** - 증여세 계산 및 세율 구조
- **[예적금계산기](.claude/docs/savings-calculator.md)** - 예금/적금 이자 계산
- **[상태 관리](.claude/docs/state-management.md)** - Zustand store 구조 및 동기화
- **[계산 로직](.claude/docs/calculations.md)** - 상환 방식별 계산 알고리즘
- **[컴포넌트 구조](.claude/docs/components.md)** - 레이아웃 및 재사용 컴포넌트
- **[SEO TODO](.claude/docs/seo-todos.md)** - SEO 최적화 및 배포 후 작업 목록

### 📖 문서 활용

각 문서는 다음 내용을 포함합니다:
- 개요 및 목적
- 주요 기능
- 컴포넌트/로직 구조
- 코드 예시
- 파일 위치

세션이 끊겼을 때도 Claude가 각 페이지의 로직을 이해할 수 있도록 상세하게 작성되었습니다.

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 자금조달계획서
│   ├── loan-calculator/        # 대출이자계산기
│   ├── gift-tax-calculator/    # 증여세계산기
│   ├── savings-calculator/     # 예적금계산기
│   └── investment-calculator/  # 투자계산기
├── components/
│   ├── layout/                 # 레이아웃 컴포넌트
│   └── calculators/            # 계산기 컴포넌트
├── store/                      # Zustand 전역 상태
├── utils/                      # 유틸리티 함수
├── types/                      # 타입 정의
└── styles/                     # 스타일 파일
```

## 환경 변수

`.env.local` 파일 생성 (선택사항):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXX
```

## 개발 상태

### 완료된 작업
- ✅ Next.js 14 프로젝트 구조 생성
- ✅ TypeScript 설정
- ✅ Tailwind CSS + SCSS 설정
- ✅ ESLint + Prettier 설정
- ✅ Zustand 전역 상태 관리
- ✅ 로컬 스토리지 자동 저장
- ✅ 반응형 레이아웃 (Header, Sidebar, MobileNav)
- ✅ 자금조달계획서 전체 구현
- ✅ 대출이자계산기 전체 구현
- ✅ 증여세계산기 전체 구현
- ✅ 예적금계산기 기본 구현
- ✅ 금액 동기화 기능
- ✅ 토스트 알림
- ✅ 증여세 자동 계산
- ✅ 부모님 차용 최적 이자율 산출
- ✅ 3가지 상환 방식 지원
- ✅ 월별 상환 스케줄 테이블
- ✅ **SEO 최적화**: 메타데이터, Open Graph, Twitter Card, robots.txt, sitemap.xml, JSON-LD

### 향후 계획
- ⏳ 예적금계산기 고도화
- ⏳ 투자계산기 구현
- ⏳ PDF 다운로드 기능
- ⏳ 인쇄 최적화
- ⏳ 광고 영역 구현 (Google AdSense)
- ⏳ 다크 모드 지원
- ⏳ 데이터 내보내기/가져오기

### Vercel 배포 후 필수 작업
- [ ] Google Search Console 등록 및 verification 코드 추가
- [ ] Naver Search Advisor 등록 및 verification 코드 추가
- [ ] Open Graph 이미지 생성 (`public/og-image.png`, 1200x630)
- [ ] Favicon 및 아이콘 파일 추가 (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`)
- [ ] Google Analytics 설정 (선택사항)

자세한 내용은 **[SEO TODO 문서](.claude/docs/seo-todos.md)**를 참고하세요.

## 라이선스

Private

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

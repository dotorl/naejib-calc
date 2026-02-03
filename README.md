# 내집계산기 (NaejibCalc)

주택 구매자를 위한 자금조달계획서 및 대출이자계산기 서비스

## 프로젝트 구조

```
naejib-calc/
├── public/                    # 정적 파일
│   ├── icons/
│   └── images/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 메인 페이지 (자금조달계획서)
│   │   ├── loan-calculator/   # 대출이자계산기
│   │   ├── savings-calculator/ # 예적금계산기
│   │   ├── investment-calculator/ # 투자계산기
│   │   └── gift-tax-calculator/ # 증여세계산기
│   ├── components/            # 컴포넌트
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── calculators/       # 계산기 컴포넌트
│   │   ├── common/            # 공통 컴포넌트
│   │   └── ads/               # 광고 컴포넌트
│   ├── store/                 # Zustand 전역 상태
│   ├── hooks/                 # 커스텀 훅
│   ├── utils/                 # 유틸리티 함수
│   ├── types/                 # 타입 정의
│   └── styles/                # 스타일 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + SCSS
- **State Management**: Zustand
- **Icons**: Lucide React

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

## 페이지 라우트

- `/` - 자금조달계획서
- `/loan-calculator` - 대출이자계산기
- `/savings-calculator` - 예적금계산기
- `/investment-calculator` - 투자계산기
- `/gift-tax-calculator` - 증여세계산기

## 개발 상태

현재 프로젝트는 기본 구조와 라우트가 설정되어 있으며, 각 페이지는 빈 페이지로 구성되어 있습니다.

### 완료된 작업
- ✅ Next.js 프로젝트 구조 생성
- ✅ 페이지 라우트 설정
- ✅ Zustand 스토어 기본 구조
- ✅ 타입 정의
- ✅ 유틸리티 함수 (계산, 포맷팅)
- ✅ 기본 컴포넌트 구조
- ✅ 커스텀 훅

### 구현 예정
- ⏳ 자금조달계획서 상세 구현
- ⏳ 대출이자계산기 상세 구현
- ⏳ 예적금계산기 구현
- ⏳ 투자계산기 구현
- ⏳ 증여세계산기 구현
- ⏳ 반응형 레이아웃 구현
- ⏳ 광고 영역 구현

## 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXX
```

## 라이선스

Private

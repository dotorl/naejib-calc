import type { Metadata } from "next";
import "@/styles/globals.scss";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://naejibcalc.kr'),
  title: {
    default: '내집계산기 - 대출이자계산기, 자금조달계획서, 증여세계산기',
    template: '%s | 내집계산기'
  },
  description: '주택 구매를 위한 자금조달계획서 작성, 대출이자계산기, 증여세 계산을 한 곳에서. 원리금균등, 원금균등, 만기일시 상환 방식 지원. 부모님 차용 최적 이자율 계산.',
  keywords: ['대출이자계산기', '자금조달계획서', '증여세계산기', '주택대출', '부모님차용', '원리금균등', '원금균등', '만기일시상환', '주택구매', '내집마련'],
  authors: [{ name: '내집계산기' }],
  creator: '내집계산기',
  publisher: '내집계산기',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '내집계산기 - 주택 구매 금융 계산 서비스',
    description: '주택 구매를 위한 자금조달계획서 작성, 대출이자계산기, 증여세 계산을 한 곳에서. 원리금균등, 원금균등, 만기일시 상환 방식 지원.',
    url: 'https://naejibcalc.kr',
    siteName: '내집계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '내집계산기 - 주택 구매 금융 계산 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '내집계산기 - 주택 구매 금융 계산 서비스',
    description: '주택 구매를 위한 자금조달계획서 작성, 대출이자계산기, 증여세 계산을 한 곳에서.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Google Search Console 등록 후 추가
    // google: 'google-site-verification-code',
    // naver: 'naver-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '내집계산기',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    description: '주택 구매를 위한 자금조달계획서 작성, 대출이자계산기, 증여세 계산을 한 곳에서. 원리금균등, 원금균등, 만기일시 상환 방식 지원.',
    url: 'https://naejibcalc.kr',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
          }}
        />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

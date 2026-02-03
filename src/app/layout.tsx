import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: {
    default: '내집계산기 - 대출이자계산기, 자금조달계획서',
    template: '%s | 내집계산기'
  },
  description: '주택 구매를 위한 자금조달계획서 작성, 대출이자계산기, 증여세 계산을 한 곳에서. 원리금균등, 원금균등, 만기일시 상환 계산.',
  keywords: ['대출이자계산기', '자금조달계획서', '증여세계산기', '주택대출', '부모님차용'],
  openGraph: {
    title: '내집계산기',
    description: '주택 구매 자금 계획의 모든 것',
    url: 'https://naejibcalc.kr',
    siteName: '내집계산기',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}

import GiftTaxCalculator from '@/components/calculators/GiftTaxCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '증여세계산기',
  description: '증여세와 공제 금액을 정확하게 계산하세요. 5단계 누진세율을 적용하며, 신고세액공제 옵션을 제공합니다. 부모님 지원금의 증여세를 미리 계산해보세요.',
  keywords: ['증여세계산기', '증여세', '누진세율', '신고세액공제', '부모님지원', '증여공제'],
  openGraph: {
    title: '증여세계산기 | 내집계산기',
    description: '증여세와 공제 금액을 정확하게 계산하세요. 5단계 누진세율을 적용하며, 신고세액공제 옵션을 제공합니다.',
    url: 'https://naejibcalc.kr/gift-tax-calculator',
  },
};

export default function GiftTaxCalculatorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">증여세계산기</h1>
        <p className="text-gray-600">증여세와 공제 금액을 계산하세요</p>
      </div>

      <GiftTaxCalculator />
    </div>
  );
}

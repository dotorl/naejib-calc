import LoanCalculator from '@/components/calculators/LoanCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대출이자계산기',
  description: '은행 대출과 부모님 차용의 이자를 비교하고 계산하세요. 원리금균등, 원금균등, 만기일시 상환 방식을 지원하며, 부모님 차용 시 최적 이자율을 자동으로 산출합니다.',
  keywords: ['대출이자계산기', '주택대출', '원리금균등', '원금균등', '만기일시상환', '부모님차용', '최적이자율'],
  openGraph: {
    title: '대출이자계산기 | 내집계산기',
    description: '은행 대출과 부모님 차용의 이자를 비교하고 계산하세요. 원리금균등, 원금균등, 만기일시 상환 방식을 지원합니다.',
    url: 'https://naejibcalc.kr/loan-calculator',
  },
};

export default function LoanCalculatorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">대출이자계산기</h1>
        <p className="text-gray-600">은행 대출과 부모님 차용의 이자를 비교하고 계산하세요</p>
      </div>

      <LoanCalculator />
    </div>
  );
}

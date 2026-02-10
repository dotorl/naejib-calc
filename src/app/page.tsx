import FundingPlan from '@/components/calculators/FundingPlan';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자금조달계획서',
  description: '주택 구매를 위한 자금 조달 계획을 작성하세요. 자기자금, 금융기관 대출, 부모님 차용을 체계적으로 정리하고 증여세를 자동으로 계산합니다.',
  keywords: ['자금조달계획서', '주택구매', '자금계획', '증여세', '부모님지원', '내집마련'],
  openGraph: {
    title: '자금조달계획서 | 내집계산기',
    description: '주택 구매를 위한 자금 조달 계획을 작성하세요. 자기자금, 금융기관 대출, 부모님 차용을 체계적으로 정리하고 증여세를 자동으로 계산합니다.',
    url: 'https://naejibcalc.kr',
  },
};

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">자금조달계획서</h1>
        <p className="text-gray-600">주택 구매를 위한 자금 조달 계획을 작성하세요</p>
      </div>

      <FundingPlan />
    </div>
  );
}

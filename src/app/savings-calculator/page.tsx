import SavingsCalculator from '@/components/calculators/SavingsCalculator';

export default function SavingsCalculatorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">예적금계산기</h1>
        <p className="text-sm sm:text-base text-gray-600">예금과 적금의 이자를 계산하세요</p>
      </div>

      <SavingsCalculator />
    </div>
  );
}

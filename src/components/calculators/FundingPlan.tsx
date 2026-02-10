'use client';

import { useState, useEffect } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

// 숫자 입력 필드 컴포넌트
function NumberInputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [localValue, setLocalValue] = useState(value === 0 ? '' : value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const num = Number(e.target.value) || 0;
    onChange(num);
  };

  const handleBlur = () => {
    const num = Number(localValue) || 0;
    setLocalValue(num === 0 ? '' : num.toString());
  };

  return (
    <div className="flex justify-between items-center py-1 gap-2">
      <span className="text-xs sm:text-sm text-gray-600 flex-shrink min-w-0">{label}</span>
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0"
        className="w-24 sm:w-36 px-1 sm:px-2 py-1 border rounded text-right text-xs sm:text-sm flex-shrink-0"
      />
    </div>
  );
}

// 자금조달계획서 컴포넌트
export default function FundingPlan() {
  const router = useRouter();
  const fundingPlan = useCalculatorStore((state) => state.fundingPlan);
  const setFundingPlan = useCalculatorStore((state) => state.setFundingPlan);
  const applyFundingToLoan = useCalculatorStore((state) => state.applyFundingToLoan);
  const lastAppliedAction = useCalculatorStore((state) => state.lastAppliedAction);
  const lastAppliedTime = useCalculatorStore((state) => state.lastAppliedTime);
  const clearAppliedAction = useCalculatorStore((state) => state.clearAppliedAction);

  const [isApplied, setIsApplied] = useState(false);

  const selfFunds = fundingPlan.selfFunds;
  const bankLoans = fundingPlan.bankLoans;
  const otherBorrowing = fundingPlan.otherBorrowing;

  const setSelfFunds = (newSelfFunds: typeof selfFunds) => {
    setFundingPlan({ selfFunds: newSelfFunds });
  };

  const setBankLoans = (newBankLoans: typeof bankLoans) => {
    setFundingPlan({ bankLoans: newBankLoans });
  };

  const setOtherBorrowing = (value: number) => {
    setFundingPlan({ otherBorrowing: value });
  };

  // 대출이자계산기에서 적용되었을 때 토스트 표시
  useEffect(() => {
    if (lastAppliedAction === 'loan->funding' && lastAppliedTime) {
      const timeSinceUpdate = Date.now() - new Date(lastAppliedTime).getTime();
      if (timeSinceUpdate < 5000) {
        clearAppliedAction();
        toast.success('대출이자계산기에서 금액이 적용되었습니다');
      }
    }
  }, [lastAppliedAction, lastAppliedTime, clearAppliedAction]);

  const formatWon = (n: number) => n.toLocaleString('ko-KR') + '원';

  // 증여 관련 계산
  const totalGift =
    selfFunds.pastGift +
    selfFunds.basicDeduction +
    selfFunds.marriageDeduction +
    selfFunds.additionalGift;
  const deductionTotal = selfFunds.basicDeduction + selfFunds.marriageDeduction;
  const taxableGift = Math.max(0, totalGift - deductionTotal); // 증여합계 - 공제금액

  // 증여세 계산 (누진세율)
  const calculateGiftTax = (amount: number) => {
    if (amount <= 0) return 0;
    if (amount <= 100000000) return amount * 0.1;
    if (amount <= 500000000) return 10000000 + (amount - 100000000) * 0.2;
    if (amount <= 1000000000) return 90000000 + (amount - 500000000) * 0.3;
    if (amount <= 3000000000) return 240000000 + (amount - 1000000000) * 0.4;
    return 1040000000 + (amount - 3000000000) * 0.5;
  };

  const giftTax = calculateGiftTax(taxableGift);

  // 부모님 총 지원예상액 (신규 증여 + 차용금)
  const newGiftTotal =
    selfFunds.basicDeduction + selfFunds.marriageDeduction + selfFunds.additionalGift;
  const parentTotalSupport = newGiftTotal + otherBorrowing;

  const selfFundsTotal =
    selfFunds.bankDeposit +
    totalGift +
    selfFunds.stockBondSale +
    selfFunds.cashOther +
    selfFunds.realEstateSale;
  const bankLoansTotal = Object.values(bankLoans).reduce((a, b) => a + b, 0);
  const grandTotal = selfFundsTotal + bankLoansTotal + otherBorrowing;

  const handleApplyToLoan = () => {
    applyFundingToLoan();
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      router.push('/loan-calculator');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 자기자금 */}
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <span className="font-semibold text-green-700">💰 자기자금</span>
            <span className="font-bold text-green-600">{formatWon(selfFundsTotal)}</span>
          </div>
          <div className="space-y-2">
            <NumberInputField
              label="금융기관 예금액"
              value={selfFunds.bankDeposit}
              onChange={(v) => setSelfFunds({ ...selfFunds, bankDeposit: v })}
            />

            {/* 증여·상속 세부 항목 */}
            <div className="border rounded p-2 bg-gray-50 space-y-1">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-gray-700">증여·상속</span>
                <span className="font-bold text-green-600">{formatWon(totalGift)}</span>
              </div>
              <NumberInputField
                label="└ 과거 증여 (증여신고 필요)"
                value={selfFunds.pastGift}
                onChange={(v) => setSelfFunds({ ...selfFunds, pastGift: v })}
              />
              <NumberInputField
                label="└ (신규) 기본공제 (최대 5천)"
                value={selfFunds.basicDeduction}
                onChange={(v) =>
                  setSelfFunds({ ...selfFunds, basicDeduction: Math.min(v, 50000000) })
                }
              />
              <NumberInputField
                label="└ (신규) 결혼공제 (최대 1억)"
                value={selfFunds.marriageDeduction}
                onChange={(v) =>
                  setSelfFunds({ ...selfFunds, marriageDeduction: Math.min(v, 100000000) })
                }
              />
              <NumberInputField
                label="└ (신규) 추가 증여"
                value={selfFunds.additionalGift}
                onChange={(v) => setSelfFunds({ ...selfFunds, additionalGift: v })}
              />
              <div className="flex justify-between items-center pt-2 border-t text-sm">
                <span className="font-semibold text-gray-700">증여 합계</span>
                <span className="font-bold text-green-600">{formatWon(totalGift)}</span>
              </div>
              {taxableGift > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded space-y-1">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>공제금액 (기본+결혼)</span>
                    <span>-{formatWon(deductionTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-600">과세 대상</span>
                    <span className="font-bold text-red-600">{formatWon(taxableGift)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-700 font-semibold">증여세</span>
                    <span className="font-bold text-red-700">{formatWon(giftTax)}</span>
                  </div>
                  {selfFunds.pastGift > 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      ⚠️ 과거 증여 {formatWon(selfFunds.pastGift)} 포함하여 증여세 산정됨
                    </div>
                  )}
                </div>
              )}
            </div>

            <NumberInputField
              label="주식·채권 매각대금"
              value={selfFunds.stockBondSale}
              onChange={(v) => setSelfFunds({ ...selfFunds, stockBondSale: v })}
            />
            <NumberInputField
              label="현금 등 그 밖의 자금"
              value={selfFunds.cashOther}
              onChange={(v) => setSelfFunds({ ...selfFunds, cashOther: v })}
            />
            <NumberInputField
              label="부동산 처분대금"
              value={selfFunds.realEstateSale}
              onChange={(v) => setSelfFunds({ ...selfFunds, realEstateSale: v })}
            />
          </div>
        </div>

        {/* 금융기관 대출 */}
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <span className="font-semibold text-blue-700">🏦 금융기관 대출</span>
            <span className="font-bold text-blue-600">{formatWon(bankLoansTotal)}</span>
          </div>
          <div className="space-y-2">
            <NumberInputField
              label="주택담보대출"
              value={bankLoans.mortgageLoan}
              onChange={(v) => setBankLoans({ ...bankLoans, mortgageLoan: v })}
            />
            <NumberInputField
              label="신용대출"
              value={bankLoans.creditLoan}
              onChange={(v) => setBankLoans({ ...bankLoans, creditLoan: v })}
            />
            <NumberInputField
              label="그 밖의 대출"
              value={bankLoans.otherLoan}
              onChange={(v) => setBankLoans({ ...bankLoans, otherLoan: v })}
            />
          </div>
        </div>

        {/* 그 밖의 차입금 */}
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <span className="font-semibold text-orange-700">🤝 그 밖의 차입금</span>
            <span className="font-bold text-orange-600">{formatWon(otherBorrowing)}</span>
          </div>
          <div className="space-y-2">
            <NumberInputField
              label="부모님 차용 등"
              value={otherBorrowing}
              onChange={setOtherBorrowing}
            />
          </div>

          {/* 부모님 총 지원예상액 */}
          {parentTotalSupport > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-200 bg-orange-50 rounded p-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-orange-800">👨‍👩‍👧 부모님 총 지원예상액</span>
                <span className="font-bold text-orange-700">{formatWon(parentTotalSupport)}</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 space-y-1">
                <div>• 신규 증여: {formatWon(newGiftTotal)} (기본공제 + 결혼공제 + 추가증여)</div>
                <div>• 차용금: {formatWon(otherBorrowing)}</div>
              </div>
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-orange-200">
                💡 부모님이 실제로 준비해야 할 총 금액입니다. (과거 증여 제외)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 총계 */}
      <div className="mt-4 pt-4 border-t-2 border-gray-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-800">📊 총 자금조달 합계</span>
          <span className="text-xl sm:text-2xl font-bold text-purple-600">{formatWon(grandTotal)}</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
          <span className="whitespace-nowrap">자기자금 {formatWon(selfFundsTotal)}</span>
          <span>+</span>
          <span className="whitespace-nowrap">금융기관 {formatWon(bankLoansTotal)}</span>
          <span>+</span>
          <span className="whitespace-nowrap">차입금 {formatWon(otherBorrowing)}</span>
        </div>

        {/* 금액 동기화 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-3">💡 금액 동기화</h3>
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-blue-700">
                <Link href="/loan-calculator" className="underline hover:text-blue-900">
                  대출이자계산기
                </Link>
                에서 은행 대출과 부모님 차용 금액을 입력한 후 &ldquo;자금조달계획서에 금액 적용하기&rdquo; 버튼을
                클릭하면 해당 금액이 자동으로 여기에 입력됩니다.
              </p>
              <div className="pt-2 border-t border-blue-200">
                <button
                  onClick={handleApplyToLoan}
                  className={`w-full py-2.5 rounded-lg text-sm sm:text-base font-semibold transition ${
                    isApplied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isApplied ? '✓ 적용 완료!' : '⬇️ 대출이자계산기에 금액 적용하기'}
                </button>
                <div className="text-[10px] sm:text-xs text-blue-600 mt-2 text-center leading-tight">
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="whitespace-nowrap">금융기관 {formatWon(bankLoansTotal)}</span>
                    <span>+</span>
                    <span className="whitespace-nowrap">차입금 {formatWon(otherBorrowing)}</span>
                    <span>→</span>
                    <span className="whitespace-nowrap">대출이자계산기</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

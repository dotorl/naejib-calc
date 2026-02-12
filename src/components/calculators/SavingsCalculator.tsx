'use client';

import { useState } from 'react';
import { formatNumberWithCommas, parseFormattedNumber, filterIntegerInput } from '@/utils/formatNumber';

type SavingsType = 'deposit' | 'installment';
type PeriodUnit = 'year' | 'month';
type InterestType = 'simple' | 'compound';
type TaxType = 'normal' | 'exempt' | 'preferential';

export default function SavingsCalculator() {
  const [savingsType, setSavingsType] = useState<SavingsType>('deposit');

  // 예금 상태
  const [depositAmount, setDepositAmount] = useState<number>(100000000);
  const [depositPeriod, setDepositPeriod] = useState<number>(3);
  const [depositPeriodUnit, setDepositPeriodUnit] = useState<PeriodUnit>('year');
  const [depositInterestRate, setDepositInterestRate] = useState<number>(3.5);
  const [depositInterestType, setDepositInterestType] = useState<InterestType>('compound');
  const [depositTaxType, setDepositTaxType] = useState<TaxType>('preferential');
  const [depositTaxRate, setDepositTaxRate] = useState<number>(1.4);

  // 적금 상태
  const [installmentAmount, setInstallmentAmount] = useState<number>(1000000);
  const [installmentPeriod, setInstallmentPeriod] = useState<number>(3);
  const [installmentPeriodUnit, setInstallmentPeriodUnit] = useState<PeriodUnit>('year');
  const [installmentInterestRate, setInstallmentInterestRate] = useState<number>(3.5);
  const [installmentInterestType, setInstallmentInterestType] = useState<InterestType>('compound');
  const [installmentTaxType, setInstallmentTaxType] = useState<TaxType>('preferential');
  const [installmentTaxRate, setInstallmentTaxRate] = useState<number>(1.4);

  // 결과
  const [result, setResult] = useState<{
    principal: number;
    interest: number;
    tax: number;
    total: number;
  } | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Focus 상태 관리
  const [amountFocused, setAmountFocused] = useState(false);
  const [periodFocused, setPeriodFocused] = useState(false);

  const formatWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';
  const formatNum = (n: number) => Math.round(n).toLocaleString('ko-KR');

  const calculateDeposit = () => {
    const months = depositPeriodUnit === 'year' ? depositPeriod * 12 : depositPeriod;
    const monthlyRate = depositInterestRate / 100 / 12;
    let interest = 0;

    if (depositInterestType === 'simple') {
      // 단리
      const years = months / 12;
      interest = depositAmount * (depositInterestRate / 100) * years;
    } else {
      // 월복리
      interest = depositAmount * (Math.pow(1 + monthlyRate, months) - 1);
    }

    let tax = 0;
    if (depositTaxType === 'normal') {
      tax = interest * 0.154;
    } else if (depositTaxType === 'preferential') {
      tax = interest * (depositTaxRate / 100);
    }

    setResult({
      principal: depositAmount,
      interest: interest,
      tax: tax,
      total: depositAmount + interest - tax,
    });
  };

  const calculateInstallment = () => {
    const months = installmentPeriodUnit === 'year' ? installmentPeriod * 12 : installmentPeriod;
    const monthlyRate = installmentInterestRate / 100 / 12;
    let interest = 0;

    if (installmentInterestType === 'simple') {
      // 단리
      interest = installmentAmount * months * (months + 1) / 2 * monthlyRate;
    } else {
      // 월복리
      interest = installmentAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate - months);
    }

    let tax = 0;
    if (installmentTaxType === 'normal') {
      tax = interest * 0.154;
    } else if (installmentTaxType === 'preferential') {
      tax = interest * (installmentTaxRate / 100);
    }

    setResult({
      principal: installmentAmount * months,
      interest: interest,
      tax: tax,
      total: installmentAmount * months + interest - tax,
    });
  };

  const handleCalculate = () => {
    if (savingsType === 'deposit') {
      calculateDeposit();
    } else {
      calculateInstallment();
    }
  };

  const handleReset = () => {
    if (savingsType === 'deposit') {
      setDepositAmount(100000000);
      setDepositPeriod(3);
      setDepositPeriodUnit('year');
      setDepositInterestRate(3.5);
      setDepositInterestType('compound');
      setDepositTaxType('preferential');
      setDepositTaxRate(1.4);
    } else {
      setInstallmentAmount(1000000);
      setInstallmentPeriod(3);
      setInstallmentPeriodUnit('year');
      setInstallmentInterestRate(3.5);
      setInstallmentInterestType('compound');
      setInstallmentTaxType('preferential');
      setInstallmentTaxRate(1.4);
    }
    setResult(null);
    setShowDetail(false);
  };

  const isDeposit = savingsType === 'deposit';
  const amount = isDeposit ? depositAmount : installmentAmount;
  const setAmount = isDeposit ? setDepositAmount : setInstallmentAmount;
  const period = isDeposit ? depositPeriod : installmentPeriod;
  const setPeriod = isDeposit ? setDepositPeriod : setInstallmentPeriod;
  const periodUnit = isDeposit ? depositPeriodUnit : installmentPeriodUnit;
  const setPeriodUnit = isDeposit ? setDepositPeriodUnit : setInstallmentPeriodUnit;
  const interestRate = isDeposit ? depositInterestRate : installmentInterestRate;
  const setInterestRate = isDeposit ? setDepositInterestRate : setInstallmentInterestRate;
  const interestType = isDeposit ? depositInterestType : installmentInterestType;
  const setInterestType = isDeposit ? setDepositInterestType : setInstallmentInterestType;
  const taxType = isDeposit ? depositTaxType : installmentTaxType;
  const setTaxType = isDeposit ? setDepositTaxType : setInstallmentTaxType;
  const taxRate = isDeposit ? depositTaxRate : installmentTaxRate;
  const setTaxRate = isDeposit ? setDepositTaxRate : setInstallmentTaxRate;

  return (
    <div className="space-y-4">
      {/* 탭 */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSavingsType('deposit');
            setResult(null);
            setShowDetail(false);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            savingsType === 'deposit' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          🏦 예금
        </button>
        <button
          onClick={() => {
            setSavingsType('installment');
            setResult(null);
            setShowDetail(false);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            savingsType === 'installment' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          💰 적금
        </button>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {/* 예치금액/월납입금 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {isDeposit ? '예치금액' : '월납입금'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberWithCommas(amount)}
              onChange={(e) => {
                const filtered = filterIntegerInput(e.target.value);
                const num = parseFormattedNumber(filtered || '0');
                setAmount(num);
              }}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setTimeout(() => setAmountFocused(false), 200)}
              className="w-full px-3 py-2 border rounded text-right font-semibold text-lg"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formatWon(amount)}
            </div>
            {amountFocused && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[100000, 1000000, 10000000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(amount + value)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition"
                  >
                    +{value === 100000 ? '10만' : value === 1000000 ? '100만' : '1,000만'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 예금기간/납입기간 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {isDeposit ? '예금기간' : '납입기간'}
            </label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setPeriodUnit('year')}
                className={`px-4 py-1 rounded font-medium transition text-sm ${
                  periodUnit === 'year' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                년
              </button>
              <button
                onClick={() => setPeriodUnit('month')}
                className={`px-4 py-1 rounded font-medium transition text-sm ${
                  periodUnit === 'month' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                월
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberWithCommas(period)}
              onChange={(e) => {
                const filtered = filterIntegerInput(e.target.value);
                const num = parseFormattedNumber(filtered || '0');
                setPeriod(num);
              }}
              onFocus={() => setPeriodFocused(true)}
              onBlur={() => setTimeout(() => setPeriodFocused(false), 200)}
              className="w-full px-3 py-2 border rounded text-right font-semibold"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {period} {periodUnit === 'year' ? '년' : '월'}
            </div>
            {periodFocused && periodUnit === 'year' && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[1, 5, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => setPeriod(period + value)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition"
                  >
                    +{value}년
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 연이자율 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">연이자율</label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setInterestType('simple')}
                className={`px-4 py-1 rounded font-medium transition text-sm ${
                  interestType === 'simple' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                단리
              </button>
              <button
                onClick={() => setInterestType('compound')}
                className={`px-4 py-1 rounded font-medium transition text-sm ${
                  interestType === 'compound' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                월복리
              </button>
            </div>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step="0.1"
              className="w-full px-3 py-2 border rounded text-right font-semibold"
            />
            <div className="text-right text-xs text-gray-500 mt-1">{interestRate}%</div>
          </div>

          {/* 이자과세 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">이자과세</label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setTaxType('normal')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  taxType === 'normal'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                일반과세
              </button>
              <button
                onClick={() => setTaxType('exempt')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  taxType === 'exempt'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                비과세
              </button>
              <button
                onClick={() => setTaxType('preferential')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  taxType === 'preferential'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                세금우대
              </button>
            </div>
            {taxType === 'preferential' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <label className="block text-xs text-gray-600 mb-1">세금우대 세율 (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  step="0.1"
                  className="w-full px-2 py-1 border rounded text-right"
                />
                <div className="text-right text-xs text-gray-500 mt-1">{taxRate}%</div>
              </div>
            )}
            {taxType === 'normal' && (
              <div className="text-xs text-gray-500 mt-1">이자소득세 15.4% 적용</div>
            )}
          </div>

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleReset}
              className="py-2 bg-white border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              초기화
            </button>
            <button
              onClick={handleCalculate}
              className="py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition"
            >
              계산하기
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow p-4 text-white">
          <h2 className="font-bold text-lg mb-3">💰 계산 결과</h2>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-green-100 text-sm mb-1">
                {isDeposit ? '예치금' : '매월'} {formatWon(amount)}{isDeposit ? '을' : '씩'} {period}
                {periodUnit === 'year' ? '년' : '개월'}동안
              </div>
              <div className="text-green-100 text-sm mb-2">
                연 {interestRate}% ({interestType === 'simple' ? '단리' : '월복리'})로 저축하면
              </div>
              <div className="text-2xl font-bold">
                총 {formatWon(result.total)}
              </div>
              <div className="text-sm text-green-100 mt-1">수령 가능</div>
            </div>

            <button
              onClick={() => setShowDetail(!showDetail)}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded text-sm transition"
            >
              {showDetail ? '상세 내역 닫기 ▲' : '상세 내역 보기 ▼'}
            </button>

            {showDetail && (
              <div className="bg-white/10 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-white/20">
                  <span className="text-green-100">원금합계</span>
                  <span className="font-semibold">{formatWon(result.principal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/20">
                  <span className="text-green-100">세전이자</span>
                  <span className="font-semibold">{formatWon(result.interest)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/20">
                  <span className="text-green-100">
                    이자과세 ({taxType === 'normal' ? '15.4' : taxType === 'preferential' ? taxRate : '0'}%)
                  </span>
                  <span className="font-semibold text-red-300">-{formatWon(result.tax)}</span>
                </div>
                <div className="flex justify-between py-2 text-base">
                  <span className="font-bold">세후 수령액</span>
                  <span className="font-bold text-xl">{formatWon(result.total)}</span>
                </div>
              </div>
            )}

            <div className="text-xs text-green-100">
              💡 {taxType === 'normal' ? '일반과세' : taxType === 'preferential' ? '세금우대' : '비과세'} 기준 계산
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

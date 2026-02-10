'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

type RepaymentMethod = 'equalPrincipalInterest' | 'equalPrincipal' | 'bullet';

const REPAYMENT_LABELS: Record<RepaymentMethod, string> = {
  equalPrincipalInterest: '원리금균등',
  equalPrincipal: '원금균등',
  bullet: '만기일시',
};

export default function LoanCalculator() {
  const router = useRouter();
  const loanCalculator = useCalculatorStore((state) => state.loanCalculator);
  const setLoanCalculator = useCalculatorStore((state) => state.setLoanCalculator);
  const lastAppliedAction = useCalculatorStore((state) => state.lastAppliedAction);
  const lastAppliedTime = useCalculatorStore((state) => state.lastAppliedTime);
  const applyLoanToFunding = useCalculatorStore((state) => state.applyLoanToFunding);
  const clearAppliedAction = useCalculatorStore((state) => state.clearAppliedAction);

  const [loanType, setLoanType] = useState('bank');
  const [isApplied, setIsApplied] = useState(false);

  // 자금조달계획서에서 적용되었을 때 토스트 표시
  useEffect(() => {
    if (lastAppliedAction === 'funding->loan' && lastAppliedTime) {
      const timeSinceUpdate = Date.now() - new Date(lastAppliedTime).getTime();
      if (timeSinceUpdate < 5000) {
        clearAppliedAction();
        toast.success('자금조달계획서에서 금액이 적용되었습니다');
      }
    }
  }, [lastAppliedAction, lastAppliedTime, clearAppliedAction]);

  // 스토어 값들을 직접 사용
  const bankPrincipal = loanCalculator.bankPrincipal;
  const parentPrincipal = loanCalculator.parentPrincipal;
  const bankRate = loanCalculator.bankRate;
  const parentRate = loanCalculator.parentRate;
  const bankMonths = loanCalculator.bankMonths;
  const parentMonths = loanCalculator.parentMonths;
  const bankBalloon = loanCalculator.bankBalloon;
  const parentBalloon = loanCalculator.parentBalloon;
  const bankMethod = loanCalculator.bankMethod;
  const parentMethod = loanCalculator.parentMethod;
  const customOptimalRate = loanCalculator.customOptimalRate;

  // setter 함수들
  const setBankPrincipal = (value: number) => setLoanCalculator({ bankPrincipal: value });
  const setParentPrincipal = (value: number) => setLoanCalculator({ parentPrincipal: value });
  const setBankRate = (value: number) => setLoanCalculator({ bankRate: value });
  const setParentRate = (value: number) => setLoanCalculator({ parentRate: value });
  const setBankMonths = (value: number) => setLoanCalculator({ bankMonths: value });
  const setParentMonths = (value: number) => setLoanCalculator({ parentMonths: value });
  const setBankBalloon = (value: number) => setLoanCalculator({ bankBalloon: value });
  const setParentBalloon = (value: number) => setLoanCalculator({ parentBalloon: value });
  const setBankMethod = (value: RepaymentMethod) => setLoanCalculator({ bankMethod: value });
  const setParentMethod = (value: RepaymentMethod) => setLoanCalculator({ parentMethod: value });
  const setCustomOptimalRate = (value: number | null) =>
    setLoanCalculator({ customOptimalRate: value });

  const principal = loanType === 'parent' ? parentPrincipal : bankPrincipal;
  const setPrincipal = loanType === 'parent' ? setParentPrincipal : setBankPrincipal;
  const rate = loanType === 'parent' ? parentRate : bankRate;
  const setRate = loanType === 'parent' ? setParentRate : setBankRate;
  const months = loanType === 'parent' ? parentMonths : bankMonths;
  const setMonths = loanType === 'parent' ? setParentMonths : setBankMonths;
  const maxMonths = loanType === 'parent' ? 360 : 600;
  const balloonRatio = loanType === 'parent' ? parentBalloon : bankBalloon;
  const setBalloonRatio = loanType === 'parent' ? setParentBalloon : setBankBalloon;
  const method = loanType === 'parent' ? parentMethod : bankMethod;
  const setMethod = loanType === 'parent' ? setParentMethod : setBankMethod;

  const TAX_FREE_LIMIT = 10000000;

  const formatNum = (n: number) => Math.round(n).toLocaleString('ko-KR');
  const formatWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';

  // 자금조달계획서에 금액 적용하기
  const handleApplyToFunding = () => {
    applyLoanToFunding();
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      router.push('/');
    }, 1000);
  };

  const calculateSchedule = (
    principalAmount: number,
    annualRate: number,
    totalMonths: number,
    balloonPercent: number,
    repaymentMethod: RepaymentMethod
  ) => {
    const monthlyRate = annualRate / 100 / 12;
    const balloon = principalAmount * (balloonPercent / 100);
    const amortized = principalAmount - balloon;

    const rows: Array<{
      month: number;
      payment: number;
      principalPaid: number;
      interest: number;
      totalPaid: number;
      balance: number;
    }> = [];

    let balance = principalAmount;
    let totalInterest = 0;
    let totalPrincipalPaid = 0;

    for (let i = 1; i <= totalMonths; i++) {
      const interest = balance * monthlyRate;
      let principalPaid: number;
      let payment: number;

      if (repaymentMethod === 'equalPrincipalInterest') {
        if (monthlyRate === 0) {
          payment = amortized / totalMonths;
        } else {
          payment =
            (amortized * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        principalPaid = payment - interest;
      } else if (repaymentMethod === 'equalPrincipal') {
        principalPaid = amortized / totalMonths;
        payment = principalPaid + interest;
      } else if (repaymentMethod === 'bullet') {
        principalPaid = i === totalMonths ? amortized : 0;
        payment = interest + principalPaid;
      } else {
        principalPaid = 0;
        payment = 0;
      }

      if (i === totalMonths) {
        principalPaid = balance;
        payment = principalPaid + interest;
      }

      totalInterest += interest;
      totalPrincipalPaid += principalPaid;
      balance -= principalPaid;
      if (balance < 0) balance = 0;

      rows.push({
        month: i,
        payment: Math.round(payment),
        principalPaid: Math.round(principalPaid),
        interest: Math.round(interest),
        totalPaid: Math.round(totalPrincipalPaid),
        balance: Math.round(balance),
      });
    }

    const firstMonthPayment = rows.length > 0 ? rows[0].payment : 0;

    return {
      schedule: rows,
      summary: {
        monthlyPayment: Math.round(firstMonthPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalInterest + principalAmount),
        yearlyInterest: Math.round((principalAmount * annualRate) / 100),
      },
    };
  };

  const { bankSchedule, bankSummary } = useMemo(() => {
    const result = calculateSchedule(bankPrincipal, bankRate, bankMonths, bankBalloon, bankMethod);
    return { bankSchedule: result.schedule, bankSummary: result.summary };
  }, [bankPrincipal, bankRate, bankMonths, bankBalloon, bankMethod]);

  const { parentSchedule, parentSummary, parentLoan } = useMemo(() => {
    const result = calculateSchedule(
      parentPrincipal,
      parentRate,
      parentMonths,
      parentBalloon,
      parentMethod
    );

    const yearlyInterestStandard = (parentPrincipal * parentRate) / 100;
    const actualInterest = Math.max(0, yearlyInterestStandard - TAX_FREE_LIMIT);
    const calculatedOptimalRate =
      actualInterest > 0 ? (actualInterest / parentPrincipal) * 100 : 0.1;
    const optimalRate = customOptimalRate !== null ? customOptimalRate : calculatedOptimalRate;
    const isZeroInterestZone = yearlyInterestStandard <= TAX_FREE_LIMIT;

    return {
      parentSchedule: result.schedule,
      parentSummary: result.summary,
      parentLoan: {
        yearlyInterestStandard,
        actualInterest,
        optimalRate,
        calculatedOptimalRate,
        isZeroInterestZone,
        balloonAmount: parentPrincipal * (parentBalloon / 100),
      },
    };
  }, [parentPrincipal, parentRate, parentMonths, parentBalloon, parentMethod, customOptimalRate]);

  const optimalSchedule = useMemo(() => {
    const result = calculateSchedule(
      parentPrincipal,
      parentLoan.optimalRate,
      parentMonths,
      parentBalloon,
      parentMethod
    );
    return { rows: result.schedule, monthlyPayment: result.summary.monthlyPayment };
  }, [parentPrincipal, parentLoan.optimalRate, parentMonths, parentBalloon, parentMethod]);

  const displaySchedule = loanType === 'parent' ? optimalSchedule.rows : bankSchedule;

  const NumberInput = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    className = '',
  }: {
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    className?: string;
  }) => (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (v >= min && v <= max) onChange(v);
      }}
      min={min}
      max={max}
      step={step}
      className={`w-24 px-2 py-1 border rounded text-right font-semibold ${className}`}
    />
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-3">💡 금액 동기화</h3>
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-blue-700">
            <Link href="/" className="underline hover:text-blue-900">
              자금조달계획서
            </Link>
            에서 금융기관 대출과 부모님 차용 금액을 입력한 후 &ldquo;대출 계산기에 금액 적용하기&rdquo; 버튼을
            클릭하면 해당 금액이 자동으로 여기에 입력됩니다.
          </p>
          <div className="pt-2 border-t border-blue-200">
            <button
              onClick={handleApplyToFunding}
              className={`w-full py-2.5 rounded-lg text-sm sm:text-base font-semibold transition ${
                isApplied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isApplied ? '✓ 적용 완료!' : '⬆️ 자금조달계획서에 금액 적용하기'}
            </button>
            <div className="text-[10px] sm:text-xs text-blue-600 mt-2 text-center leading-tight">
              <div className="flex flex-wrap justify-center gap-1">
                <span className="whitespace-nowrap">은행 {formatWon(bankPrincipal)}</span>
                <span>+</span>
                <span className="whitespace-nowrap">차용 {formatWon(parentPrincipal)}</span>
                <span>→</span>
                <span className="whitespace-nowrap">자금조달계획서</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 요약 */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-3 sm:p-4 shadow text-white">
        <h2 className="font-bold text-base sm:text-lg mb-3">📊 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-slate-300 text-xs sm:text-sm mb-1">총 대출+차용 금액</div>
            <div className="text-xl sm:text-2xl font-bold mb-2">
              {formatWon(bankPrincipal + parentPrincipal)}
            </div>
            <div className="text-[10px] sm:text-xs space-y-1 text-slate-300">
              <div className="flex justify-between gap-2">
                <span className="whitespace-nowrap">🏦 은행</span>
                <span className="text-right">
                  {formatWon(bankPrincipal)} ({Math.floor(bankMonths / 12)}년, {bankRate}%,{' '}
                  {REPAYMENT_LABELS[bankMethod]}
                  {bankBalloon > 0 ? ` ${bankBalloon}%만기` : ''})
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="whitespace-nowrap">👨‍👩‍👧 차용</span>
                <span className="text-right">
                  {formatWon(parentPrincipal)} ({Math.floor(parentMonths / 12)}년,{' '}
                  {parentLoan.optimalRate.toFixed(2)}%, {REPAYMENT_LABELS[parentMethod]}{' '}
                  {parentBalloon}%만기)
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-slate-300 text-xs sm:text-sm mb-1">총 월 상환금<span className="hidden sm:inline"> (첫 달 기준)</span></div>
            <div className="text-xl sm:text-2xl font-bold mb-2">
              {formatWon(bankSummary.monthlyPayment + optimalSchedule.monthlyPayment)}
            </div>
            <div className="text-[10px] sm:text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>🏦 은행</span>
                <span>{formatWon(bankSummary.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>👨‍👩‍👧 차용</span>
                <span>{formatWon(optimalSchedule.monthlyPayment)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span className="text-slate-300">차용 만기상환액</span>
            <span className="text-yellow-300 font-semibold">
              {formatWon((parentPrincipal * parentBalloon) / 100)}
            </span>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        <button
          onClick={() => setLoanType('bank')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            loanType === 'bank' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          🏦 은행 대출
        </button>
        <button
          onClick={() => setLoanType('parent')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            loanType === 'parent' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          👨‍👩‍👧 부모님 차용
        </button>
      </div>

      {/* 입력 */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">총 대출금 (차용금)</label>
            <input
              type="range"
              min={10000000}
              max={1000000000}
              step={10000000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <NumberInput
                value={principal}
                onChange={setPrincipal}
                min={10000000}
                max={1000000000}
                step={10000000}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-500">{formatWon(principal)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">적정 이자율 (%)</label>
            <input
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <NumberInput
                value={rate}
                onChange={setRate}
                min={0.1}
                max={15}
                step={0.1}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-500">{rate.toFixed(1)}%</span>
            </div>
          </div>

          {loanType === 'parent' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                적용 이자율 (%)
                <span className="text-xs text-gray-400 ml-1">
                  {parentLoan.isZeroInterestZone
                    ? '(무이자 구간)'
                    : `산출: ${parentLoan.calculatedOptimalRate.toFixed(2)}%`}
                </span>
              </label>
              {parentLoan.isZeroInterestZone && (
                <div className="text-xs text-orange-500 mb-1">
                  ⚠️ 무이자 적용 구간이지만, 차용 증빙을 위해 최소 0.1% 이자 설정을 추천합니다
                </div>
              )}
              <input
                type="range"
                min={0}
                max={5}
                step={0.01}
                value={
                  customOptimalRate !== null ? customOptimalRate : parentLoan.calculatedOptimalRate
                }
                onChange={(e) => setCustomOptimalRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <NumberInput
                  value={
                    customOptimalRate !== null
                      ? customOptimalRate
                      : parentLoan.calculatedOptimalRate
                  }
                  onChange={setCustomOptimalRate}
                  min={0}
                  max={10}
                  step={0.01}
                  className="text-green-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomOptimalRate(0)}
                    className="text-xs text-orange-500 hover:underline"
                  >
                    무이자 0%
                  </button>
                  <button
                    onClick={() => setCustomOptimalRate(null)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    자동계산
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              상환기간 (최대 {loanType === 'parent' ? '30년' : '50년'})
            </label>
            {loanType === 'parent' && months > 120 && (
              <div className="text-xs text-orange-500 mb-1">
                ⚠️ 원금 상환 기간은 통상적인 수준을 기준으로 10년 이상이 되지 않도록 하는 것이
                좋습니다.
              </div>
            )}
            <input
              type="range"
              min={12}
              max={maxMonths}
              step={12}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <NumberInput
                  value={months}
                  onChange={setMonths}
                  min={12}
                  max={maxMonths}
                  step={1}
                  className="text-blue-600"
                />
                <span className="text-xs text-gray-500">개월</span>
              </div>
              <span className="text-sm text-gray-500">
                {Math.floor(months / 12)}년 {months % 12 > 0 ? `${months % 12}개월` : ''}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">만기상환비율 (%)</label>
            <input
              type="range"
              min={0}
              max={70}
              step={5}
              value={balloonRatio}
              onChange={(e) => setBalloonRatio(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <NumberInput
                value={balloonRatio}
                onChange={setBalloonRatio}
                min={0}
                max={70}
                step={1}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-500">
                {formatWon((principal * balloonRatio) / 100)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">상환방법</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(REPAYMENT_LABELS) as RepaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    method === m
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {REPAYMENT_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 부모님 차용 상세 */}
      {loanType === 'parent' && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 shadow text-white">
          <h2 className="font-bold text-lg mb-3">👨‍👩‍👧 부모님 차용 상환 상세</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-green-400/30">
              <span className="text-green-100">차용 원금</span>
              <span className="font-bold text-lg">{formatWon(parentPrincipal)}</span>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-green-100 mb-2">적용 이자율</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">연 {parentLoan.optimalRate.toFixed(2)}%</span>
                {customOptimalRate !== null && (
                  <span className="text-yellow-200 text-xs">(수동 설정)</span>
                )}
                {customOptimalRate === null && (
                  <span className="text-green-200 text-xs">(최적 이자율)</span>
                )}
              </div>
              <div className="mt-2 text-xs text-green-200 space-y-1">
                <div>
                  • 적정이자 {parentRate}% 기준: {formatWon(parentLoan.yearlyInterestStandard)} (
                  {formatNum(parentPrincipal)} × {parentRate / 100})
                </div>
                <div>
                  • 무이자 한도 차감: {formatWon(parentLoan.yearlyInterestStandard)} -{' '}
                  {formatWon(TAX_FREE_LIMIT)} = {formatWon(parentLoan.actualInterest)}
                </div>
                <div>
                  • 최적 이자율 산출: {formatNum(parentLoan.actualInterest)} ÷{' '}
                  {formatNum(parentPrincipal)} ={' '}
                  <span className="font-bold">
                    {parentLoan.isZeroInterestZone
                      ? '0%'
                      : `${parentLoan.calculatedOptimalRate.toFixed(2)}%`}
                  </span>
                </div>
                {parentLoan.isZeroInterestZone && (
                  <div className="text-yellow-200 mt-1">
                    ⚠️ 무이자 적용 구간이지만, 차용 증빙을 위해 최소 0.1% 이자 설정을 추천합니다
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-green-200 text-xs">상환 기간</div>
                <div className="font-bold">
                  {Math.floor(parentMonths / 12)}년{' '}
                  {parentMonths % 12 > 0 ? `${parentMonths % 12}개월` : ''}
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-green-200 text-xs">상환 방식</div>
                <div className="font-bold">
                  {REPAYMENT_LABELS[parentMethod]} ({parentBalloon}% 만기)
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-green-400/30">
              <span className="text-green-100">만기 상환액 ({parentBalloon}%)</span>
              <span className="font-bold">{formatWon(parentLoan.balloonAmount)}</span>
            </div>

            <div className="bg-yellow-400/20 rounded-lg p-3 border border-yellow-300/30">
              <div className="text-yellow-100 text-xs">매월 납입 금액 (첫 달 기준)</div>
              <div className="text-2xl font-bold">
                약 {formatWon(optimalSchedule.monthlyPayment)}
              </div>
            </div>

            <div className="text-xs text-green-200">
              💡 연 1,000만원 이하 이자 차익은 증여세 비과세
            </div>
          </div>
        </div>
      )}

      {/* 은행 대출 요약 */}
      {loanType === 'bank' && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 shadow text-white">
          <h2 className="font-bold text-lg mb-3">🏦 은행 대출 요약</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-blue-100 text-sm">월 상환금 (첫 달)</div>
              <div className="text-2xl font-bold">{formatWon(bankSummary.monthlyPayment)}</div>
            </div>
            <div>
              <div className="text-blue-100 text-sm">연간 이자 (단순계산)</div>
              <div className="text-2xl font-bold">{formatWon(bankSummary.yearlyInterest)}</div>
            </div>
            <div>
              <div className="text-blue-100 text-sm">총 이자</div>
              <div className="text-lg font-semibold">{formatWon(bankSummary.totalInterest)}</div>
            </div>
            <div>
              <div className="text-blue-100 text-sm">총 상환금액</div>
              <div className="text-lg font-semibold">{formatWon(bankSummary.totalPayment)}</div>
            </div>
          </div>
        </div>
      )}

      {/* 상환 스케줄 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-3 bg-gray-100 font-semibold text-gray-700">
          상환 스케줄 (
          {loanType === 'parent'
            ? `${REPAYMENT_LABELS[parentMethod]}, ${parentLoan.optimalRate.toFixed(2)}%`
            : `${REPAYMENT_LABELS[bankMethod]}, ${bankRate}%`}
          )
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">회차</th>
                <th className="px-3 py-2 text-right">월상환금</th>
                <th className="px-3 py-2 text-right">납입원금</th>
                <th className="px-3 py-2 text-right">이자</th>
                <th className="px-3 py-2 text-right">납입원금누계</th>
                <th className="px-3 py-2 text-right">잔금</th>
              </tr>
            </thead>
            <tbody>
              {displaySchedule.map((row, idx) => (
                <tr
                  key={row.month}
                  className={`border-t ${
                    idx === displaySchedule.length - 1
                      ? 'bg-yellow-50 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-3 py-2">{row.month}회</td>
                  <td className="px-3 py-2 text-right font-bold text-purple-600">
                    {formatNum(row.payment)}
                  </td>
                  <td className="px-3 py-2 text-right text-blue-600">
                    {formatNum(row.principalPaid)}
                  </td>
                  <td className="px-3 py-2 text-right text-red-500">{formatNum(row.interest)}</td>
                  <td className="px-3 py-2 text-right">{formatNum(row.totalPaid)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatNum(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';

// 증여세 구간별 세율 및 누진공제액
const TAX_BRACKETS = [
  { limit: 100000000, rate: 0.1, deduction: 0 },
  { limit: 500000000, rate: 0.2, deduction: 10000000 },
  { limit: 1000000000, rate: 0.3, deduction: 60000000 },
  { limit: 3000000000, rate: 0.4, deduction: 160000000 },
  { limit: Infinity, rate: 0.5, deduction: 460000000 },
];

// 숫자 입력 필드 컴포넌트 (focus 유지 + 외부 변경 동기화)
function NumberInputField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1000000,
  unit = '원',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  const [localValue, setLocalValue] = useState(value === 0 ? '' : value.toString());

  // 외부에서 value가 변경되면 localValue도 업데이트
  useEffect(() => {
    setLocalValue(value === 0 ? '' : value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const num = Number(e.target.value) || 0;
    if (num >= min && num <= max) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    const num = Number(localValue) || 0;
    const validNum = Math.min(Math.max(num, min), max);
    setLocalValue(validNum === 0 ? '' : validNum.toString());
    onChange(validNum);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0"
        min={min}
        max={max}
        step={step}
        className="w-32 px-2 py-1 border rounded text-right font-semibold"
      />
      <span className="text-sm text-gray-600">{unit}</span>
    </div>
  );
}

export default function GiftTaxCalculator() {
  const giftTaxCalculator = useCalculatorStore((state) => state.giftTaxCalculator);
  const setGiftTaxCalculator = useCalculatorStore((state) => state.setGiftTaxCalculator);

  const giftAmount = giftTaxCalculator.giftAmount;
  const deduction = giftTaxCalculator.deduction;
  const appraisalFee = giftTaxCalculator.appraisalFee;
  const hasReportingDiscount = giftTaxCalculator.hasReportingDiscount;

  const setGiftAmount = (value: number) => setGiftTaxCalculator({ giftAmount: value });
  const setDeduction = (value: number) => setGiftTaxCalculator({ deduction: value });
  const setAppraisalFee = (value: number) => setGiftTaxCalculator({ appraisalFee: value });
  const setHasReportingDiscount = (value: boolean) =>
    setGiftTaxCalculator({ hasReportingDiscount: value });

  const formatWon = (n: number) => Math.round(n).toLocaleString('ko-KR') + '원';
  const formatNum = (n: number) => Math.round(n).toLocaleString('ko-KR');

  // 과세표준 = 증여재산평가금액 - 증여재산공제 - 감정평가수수료
  const taxableBase = Math.max(0, giftAmount - deduction - appraisalFee);

  // 증여세 계산
  const calculateGiftTax = (amount: number) => {
    if (amount <= 0) return { tax: 0, rate: 0, deduction: 0 };

    for (const bracket of TAX_BRACKETS) {
      if (amount <= bracket.limit) {
        return {
          tax: amount * bracket.rate - bracket.deduction,
          rate: bracket.rate * 100,
          deduction: bracket.deduction,
        };
      }
    }
    return { tax: 0, rate: 0, deduction: 0 };
  };

  const { tax: calculatedTax, rate: taxRate, deduction: progressiveDeduction } = useMemo(
    () => calculateGiftTax(taxableBase),
    [taxableBase]
  );

  // 신고세액공제 (3%)
  const reportingDiscount = hasReportingDiscount ? calculatedTax * 0.03 : 0;

  // 최종 납부세액
  const finalTax = Math.max(0, calculatedTax - reportingDiscount);

  return (
    <div className="space-y-4">
      {/* 안내 문구 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 2026년 기준 증여세 안내</h3>
        <p className="text-sm text-blue-700 mb-3">
          증여세는 타인으로부터 재산을 무상으로 받을 때 부과되는 세금입니다. 증여받은 재산가액에서
          증여재산공제를 차감한 과세표준에 누진세율이 적용됩니다.
        </p>
      </div>

      {/* 입력 섹션 */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-bold text-gray-800 mb-4">📝 증여 정보 입력</h3>
        <div className="space-y-4">
          {/* 증여재산 평가금액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증여재산 평가금액
            </label>
            <input
              type="range"
              min={10000000}
              max={5000000000}
              step={10000000}
              value={giftAmount}
              onChange={(e) => setGiftAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2">
              <NumberInputField
                label=""
                value={giftAmount}
                onChange={setGiftAmount}
                min={10000000}
                max={5000000000}
                step={10000000}
              />
              <span className="text-lg font-bold text-blue-600">{formatWon(giftAmount)}</span>
            </div>
          </div>

          {/* 증여재산 공제 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증여재산 공제 금액 (직접입력)
            </label>
            <input
              type="range"
              min={0}
              max={1000000000}
              step={10000000}
              value={deduction}
              onChange={(e) => setDeduction(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2">
              <NumberInputField
                label=""
                value={deduction}
                onChange={setDeduction}
                min={0}
                max={1000000000}
                step={10000000}
              />
              <span className="text-lg font-bold text-green-600">{formatWon(deduction)}</span>
            </div>
          </div>

          {/* 감정평가 수수료 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감정평가 수수료 (선택사항)
            </label>
            <input
              type="range"
              min={0}
              max={10000000}
              step={100000}
              value={appraisalFee}
              onChange={(e) => setAppraisalFee(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2">
              <NumberInputField
                label=""
                value={appraisalFee}
                onChange={setAppraisalFee}
                min={0}
                max={10000000}
                step={100000}
              />
              <span className="text-sm text-gray-600">{formatWon(appraisalFee)}</span>
            </div>
          </div>

          {/* 신고세액공제 옵션 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="reportingDiscount"
              checked={hasReportingDiscount}
              onChange={(e) => setHasReportingDiscount(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="reportingDiscount" className="text-sm text-gray-700">
              신고세액공제 적용 (3% 공제)
            </label>
          </div>
        </div>
      </div>

      {/* 계산 결과 */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 shadow text-white">
        <h3 className="font-bold text-lg mb-4">🧮 증여세 계산 결과</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-purple-400/30">
            <span className="text-purple-100">증여재산 평가금액</span>
            <span className="font-semibold text-lg">{formatWon(giftAmount)}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-purple-100">└ 증여재산 공제</span>
            <span className="text-red-300">- {formatWon(deduction)}</span>
          </div>

          {appraisalFee > 0 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-purple-100">└ 감정평가 수수료</span>
              <span className="text-red-300">- {formatWon(appraisalFee)}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-y border-purple-400/30">
            <span className="text-purple-100 font-semibold">과세표준</span>
            <span className="font-bold text-xl">{formatWon(taxableBase)}</span>
          </div>

          {taxableBase > 0 && (
            <>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-purple-100 mb-2">적용 세율</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{taxRate}%</span>
                  <span className="text-purple-200 text-xs">
                    (누진공제액: {formatWon(progressiveDeduction)})
                  </span>
                </div>
                <div className="mt-2 text-xs text-purple-200">
                  계산식: {formatNum(taxableBase)} × {taxRate}% - {formatNum(progressiveDeduction)}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-purple-400/30">
                <span className="text-purple-100">산출 세액</span>
                <span className="font-bold text-lg">{formatWon(calculatedTax)}</span>
              </div>

              {hasReportingDiscount && reportingDiscount > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-purple-100">└ 신고세액공제 (3%)</span>
                  <span className="text-green-300">- {formatWon(reportingDiscount)}</span>
                </div>
              )}

              <div className="bg-yellow-400/20 rounded-lg p-4 border border-yellow-300/30 mt-3">
                <div className="text-yellow-100 text-sm mb-1">최종 납부세액</div>
                <div className="text-3xl font-bold">{formatWon(finalTax)}</div>
              </div>
            </>
          )}

          {taxableBase === 0 && (
            <div className="bg-green-400/20 rounded-lg p-4 border border-green-300/30">
              <div className="text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="font-bold">증여세가 부과되지 않습니다</div>
                <div className="text-xs text-green-200 mt-1">
                  증여재산 평가금액이 공제한도 내에 있습니다
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 증여세율 표 */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-bold text-gray-800 mb-3">📊 증여세율 (2026년 기준)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center border">과세표준</th>
                <th className="px-4 py-2 text-center border">증여세율</th>
                <th className="px-4 py-2 text-center border">누진공제액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-center border">1억 원 이하</td>
                <td className="px-4 py-2 text-center border font-semibold">10%</td>
                <td className="px-4 py-2 text-center border">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-center border">5억 원 이하</td>
                <td className="px-4 py-2 text-center border font-semibold">20%</td>
                <td className="px-4 py-2 text-center border">1천만 원</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center border">10억 원 이하</td>
                <td className="px-4 py-2 text-center border font-semibold">30%</td>
                <td className="px-4 py-2 text-center border">6천만 원</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-center border">30억 원 이하</td>
                <td className="px-4 py-2 text-center border font-semibold">40%</td>
                <td className="px-4 py-2 text-center border">1억 6천만 원</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center border">30억 원 초과</td>
                <td className="px-4 py-2 text-center border font-semibold">50%</td>
                <td className="px-4 py-2 text-center border">4억 6천만 원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 증여공제 팁 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-800 mb-3">💡 증여재산 공제 안내</h3>
        <div className="text-sm text-amber-900 space-y-2">
          <div className="font-medium mb-2">📌 관계별 증여재산 공제한도 (10년 합산)</div>
          <ul className="space-y-1 ml-4">
            <li>• 배우자: 6억 원</li>
            <li>• 직계존속 (성인): 5천만 원</li>
            <li>• 직계존속 (미성년자): 2천만 원</li>
            <li>• 직계비속: 5천만 원</li>
            <li>• 기타 친족: 1천만 원</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="font-medium mb-2">📌 추가 공제</div>
            <ul className="space-y-1 ml-4">
              <li>
                • <strong>결혼·출산 증여공제:</strong> 혼인신고일 전후 2년 이내 직계존속으로부터
                증여받는 경우 최대 1억 원 추가 공제 (기본공제와 별도)
              </li>
              <li>
                • <strong>창업자금 증여공제:</strong> 일정 요건을 충족하는 창업자금은 최대 5억 원까지
                추가 공제 가능
              </li>
              <li>
                • <strong>가업승계 증여공제:</strong> 중소·중견기업 가업승계 시 최대 500억 원까지 공제
                가능 (요건 충족 필요)
              </li>
            </ul>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="font-medium mb-2">⚠️ 주의사항</div>
            <ul className="space-y-1 ml-4">
              <li>• 증여재산공제는 동일인(증여자)으로부터 10년간 합산하여 적용됩니다</li>
              <li>• 증여세 신고는 증여받은 날이 속하는 달의 말일부터 3개월 이내에 해야 합니다</li>
              <li>
                • 기한 내 신고 시 신고세액공제(3%)를 받을 수 있으며, 무신고 시 가산세가 부과됩니다
              </li>
              <li>• 증여재산 가액은 증여일 현재의 시가로 평가합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

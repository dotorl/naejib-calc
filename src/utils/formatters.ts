/**
 * 숫자를 통화 형식으로 포맷팅 (예: 1000000 -> "1,000,000원")
 */
export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

/**
 * 숫자를 억/만 단위로 포맷팅 (예: 150000000 -> "1억 5천만원")
 */
export function formatKoreanCurrency(value: number): string {
  if (value === 0) return '0원';

  const eok = Math.floor(value / 100000000);
  const man = Math.floor((value % 100000000) / 10000);
  const rest = value % 10000;

  let result = '';
  if (eok > 0) result += `${eok}억`;
  if (man > 0) result += ` ${man}만`;
  if (rest > 0 && eok === 0 && man === 0) result += `${rest}`;

  return result + '원';
}

/**
 * 숫자를 퍼센트로 포맷팅 (예: 4.5 -> "4.5%")
 */
export function formatPercent(value: number): string {
  return `${value}%`;
}

/**
 * 문자열을 숫자로 변환 (콤마 제거)
 */
export function parseNumber(value: string): number {
  return Number(value.replace(/,/g, '')) || 0;
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

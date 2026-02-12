/**
 * 숫자를 천 단위 콤마로 포맷팅
 */
export function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
}

/**
 * 콤마가 포함된 문자열에서 숫자만 추출
 */
export function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 입력값에서 숫자와 소수점만 허용
 */
export function filterNumericInput(value: string): string {
  return value.replace(/[^\d.]/g, '');
}

/**
 * 정수만 허용 (소수점 제거)
 */
export function filterIntegerInput(value: string): string {
  return value.replace(/[^\d]/g, '');
}

import type { RepaymentMethod, LoanCalculation, PaymentSchedule } from '@/types/calculator';

/**
 * 대출 이자 계산
 */
export function calculateLoan(
  principal: number,
  annualRate: number,
  months: number,
  balloonMonths: number = 0,
  method: RepaymentMethod = 'equalPayment'
): LoanCalculation {
  if (principal <= 0 || months <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [],
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const schedule: PaymentSchedule[] = [];

  let balance = principal;
  let totalInterest = 0;
  let monthlyPayment = 0;

  // 원리금균등 방식
  if (method === 'equalPayment') {
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlyPayment = principal / months;
    }

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPayment - interest;

      balance -= principalPayment;
      totalInterest += interest;

      schedule.push({
        month,
        principal: principalPayment,
        interest,
        payment: monthlyPayment,
        balance: Math.max(0, balance),
      });
    }
  }
  // 원금균등 방식
  else if (method === 'equalPrincipal') {
    const principalPayment = principal / months;

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const payment = principalPayment + interest;

      balance -= principalPayment;
      totalInterest += interest;

      schedule.push({
        month,
        principal: principalPayment,
        interest,
        payment,
        balance: Math.max(0, balance),
      });
    }

    monthlyPayment = schedule[0]?.payment || 0;
  }
  // 만기일시 상환
  else if (method === 'balloon') {
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principalPayment = month === months ? balance : 0;
      const payment = interest + principalPayment;

      if (month === months) {
        balance = 0;
      }
      totalInterest += interest;

      schedule.push({
        month,
        principal: principalPayment,
        interest,
        payment,
        balance: Math.max(0, balance),
      });
    }

    monthlyPayment = schedule[0]?.payment || 0;
  }

  const totalPayment = principal + totalInterest;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

/**
 * 최적 이자율 계산 (은행 대출과 부모님 차용 비교)
 */
export function calculateOptimalRate(
  bankPrincipal: number,
  parentPrincipal: number,
  bankRate: number,
  months: number
): number {
  if (parentPrincipal <= 0 || months <= 0) return 0;

  const bankLoan = calculateLoan(bankPrincipal, bankRate, months);
  const targetInterest = bankLoan.totalInterest;

  // 부모님 차용으로 같은 이자를 내는 이자율 계산
  const totalPrincipal = bankPrincipal + parentPrincipal;
  const monthlyRate = targetInterest / totalPrincipal / months;
  const annualRate = monthlyRate * 12 * 100;

  return Math.round(annualRate * 100) / 100;
}

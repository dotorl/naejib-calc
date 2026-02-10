// 상환 방식
export type RepaymentMethod = 'equalPrincipalInterest' | 'equalPrincipal' | 'bullet';

// 자금조달계획서 상태
export interface FundingPlanState {
  selfFunds: {
    bankDeposit: number;          // 예금·적금
    pastGift: number;             // 과거 증여
    basicDeduction: number;       // 기본공제
    marriageDeduction: number;    // 혼인공제
    additionalGift: number;       // 추가 증여
    stockBondSale: number;        // 주식·채권 매각
    cashOther: number;            // 현금·기타
    realEstateSale: number;       // 부동산 매각
  };
  bankLoans: {
    mortgageLoan: number;         // 담보대출
    creditLoan: number;           // 신용대출
    otherLoan: number;            // 기타대출
  };
  otherBorrowing: number;         // 부모님차용
}

// 대출이자계산기 상태
export interface LoanCalculatorState {
  bankPrincipal: number;          // 은행대출 원금
  parentPrincipal: number;        // 부모님차용 원금
  bankRate: number;               // 은행대출 이자율
  parentRate: number;             // 부모님차용 이자율
  bankMonths: number;             // 은행대출 기간 (개월)
  parentMonths: number;           // 부모님차용 기간 (개월)
  bankBalloon: number;            // 은행대출 거치기간
  parentBalloon: number;          // 부모님차용 거치기간
  bankMethod: RepaymentMethod;    // 은행대출 상환방식
  parentMethod: RepaymentMethod;  // 부모님차용 상환방식
  customOptimalRate: number | null; // 사용자 지정 최적 이자율
}

// 증여세계산기 상태
export interface GiftTaxCalculatorState {
  giftAmount: number;             // 증여재산평가액
  deduction: number;              // 증여재산공제액
  appraisalFee: number;           // 감정평가수수료
  hasReportingDiscount: boolean;  // 신고세액공제 적용 여부
}

// 계산 결과
export interface LoanCalculation {
  monthlyPayment: number;         // 월 상환액
  totalPayment: number;           // 총 상환액
  totalInterest: number;          // 총 이자
  schedule: PaymentSchedule[];    // 상환 스케줄
}

export interface PaymentSchedule {
  month: number;                  // 회차
  principal: number;              // 원금
  interest: number;               // 이자
  payment: number;                // 납입액
  balance: number;                // 잔액
}

// 메뉴 항목
export const MENU_ITEMS = [
  {
    id: 'funding-plan',
    label: '자금조달계획서(약식)',
    icon: '🏠',
    path: '/',
  },
  {
    id: 'loan-calculator',
    label: '대출이자계산기',
    icon: '💰',
    path: '/loan-calculator',
  },
  {
    id: 'gift-tax-calculator',
    label: '증여세계산기',
    icon: '📋',
    path: '/gift-tax-calculator',
  },
  // {
  //   id: 'savings-calculator',
  //   label: '예적금계산기',
  //   icon: '🏦',
  //   path: '/savings-calculator',
  // },
  // {
  //   id: 'investment-calculator',
  //   label: '투자계산기',
  //   icon: '📈',
  //   path: '/investment-calculator',
  // },
] as const;

// 상환 방식
export const REPAYMENT_METHODS = {
  equalPayment: '원리금균등',
  equalPrincipal: '원금균등',
  balloon: '만기일시',
} as const;

// 기본 이자율
export const DEFAULT_BANK_RATE = 4.5;
export const DEFAULT_PARENT_RATE = 0;

// 기본 대출 기간 (개월)
export const DEFAULT_BANK_MONTHS = 360; // 30년
export const DEFAULT_PARENT_MONTHS = 120; // 10년

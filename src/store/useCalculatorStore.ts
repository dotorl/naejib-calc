import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FundingPlanState, LoanCalculatorState, RepaymentMethod } from '@/types/calculator';

interface CalculatorStore {
  // 상태
  fundingPlan: FundingPlanState;
  loanCalculator: LoanCalculatorState;
  lastUpdated: string | null;

  // 액션
  setFundingPlan: (data: Partial<FundingPlanState>) => void;
  setLoanCalculator: (data: Partial<LoanCalculatorState>) => void;
  applyFundingToLoan: () => void;
  resetAll: () => void;
}

const initialFundingPlan: FundingPlanState = {
  selfFunds: {
    bankDeposit: 0,
    pastGift: 0,
    basicDeduction: 0,
    marriageDeduction: 0,
    additionalGift: 0,
    stockBondSale: 0,
    cashOther: 0,
    realEstateSale: 0,
  },
  bankLoans: {
    mortgageLoan: 0,
    creditLoan: 0,
    otherLoan: 0,
  },
  otherBorrowing: 0,
};

const initialLoanCalculator: LoanCalculatorState = {
  bankPrincipal: 0,
  parentPrincipal: 0,
  bankRate: 4.5,
  parentRate: 0,
  bankMonths: 360,
  parentMonths: 120,
  bankBalloon: 0,
  parentBalloon: 0,
  bankMethod: 'equalPayment',
  parentMethod: 'equalPayment',
  customOptimalRate: null,
};

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      fundingPlan: initialFundingPlan,
      loanCalculator: initialLoanCalculator,
      lastUpdated: null,

      setFundingPlan: (data) => {
        set((state) => ({
          fundingPlan: {
            ...state.fundingPlan,
            ...data,
          },
          lastUpdated: new Date().toISOString(),
        }));
      },

      setLoanCalculator: (data) => {
        set((state) => ({
          loanCalculator: {
            ...state.loanCalculator,
            ...data,
          },
          lastUpdated: new Date().toISOString(),
        }));
      },

      applyFundingToLoan: () => {
        const { fundingPlan } = get();
        const totalBankLoans =
          fundingPlan.bankLoans.mortgageLoan +
          fundingPlan.bankLoans.creditLoan +
          fundingPlan.bankLoans.otherLoan;

        set((state) => ({
          loanCalculator: {
            ...state.loanCalculator,
            bankPrincipal: totalBankLoans,
            parentPrincipal: fundingPlan.otherBorrowing,
          },
          lastUpdated: new Date().toISOString(),
        }));
      },

      resetAll: () => {
        set({
          fundingPlan: initialFundingPlan,
          loanCalculator: initialLoanCalculator,
          lastUpdated: null,
        });
      },
    }),
    {
      name: 'naejib-calc-storage',
    }
  )
);

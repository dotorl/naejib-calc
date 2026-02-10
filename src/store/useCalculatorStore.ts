import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FundingPlanState,
  LoanCalculatorState,
  GiftTaxCalculatorState,
  RepaymentMethod,
} from '@/types/calculator';

interface CalculatorStore {
  // 상태
  fundingPlan: FundingPlanState;
  loanCalculator: LoanCalculatorState;
  giftTaxCalculator: GiftTaxCalculatorState;
  lastUpdated: string | null;
  lastAppliedAction: 'funding->loan' | 'loan->funding' | null;
  lastAppliedTime: string | null;

  // 액션
  setFundingPlan: (data: Partial<FundingPlanState>) => void;
  setLoanCalculator: (data: Partial<LoanCalculatorState>) => void;
  setGiftTaxCalculator: (data: Partial<GiftTaxCalculatorState>) => void;
  applyFundingToLoan: () => void;
  applyLoanToFunding: () => void;
  clearAppliedAction: () => void;
  resetAll: () => void;
}

const initialFundingPlan: FundingPlanState = {
  selfFunds: {
    bankDeposit: 0,
    pastGift: 0,
    basicDeduction: 50000000,
    marriageDeduction: 100000000,
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
  bankPrincipal: 400000000,
  parentPrincipal: 300000000,
  bankRate: 4.3,
  parentRate: 4.6,
  bankMonths: 360,
  parentMonths: 120,
  bankBalloon: 0,
  parentBalloon: 30,
  bankMethod: 'equalPrincipalInterest',
  parentMethod: 'equalPrincipalInterest',
  customOptimalRate: null,
};

const initialGiftTaxCalculator: GiftTaxCalculatorState = {
  giftAmount: 100000000,
  deduction: 0,
  appraisalFee: 0,
  hasReportingDiscount: true,
};

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      fundingPlan: initialFundingPlan,
      loanCalculator: initialLoanCalculator,
      giftTaxCalculator: initialGiftTaxCalculator,
      lastUpdated: null,
      lastAppliedAction: null,
      lastAppliedTime: null,

      setFundingPlan: (data) => {
        set((state) => ({
          fundingPlan: {
            ...state.fundingPlan,
            selfFunds: { ...state.fundingPlan.selfFunds, ...(data.selfFunds || {}) },
            bankLoans: { ...state.fundingPlan.bankLoans, ...(data.bankLoans || {}) },
            ...(data.otherBorrowing !== undefined && { otherBorrowing: data.otherBorrowing }),
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

      setGiftTaxCalculator: (data) => {
        set((state) => ({
          giftTaxCalculator: {
            ...state.giftTaxCalculator,
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
          lastAppliedAction: 'funding->loan',
          lastAppliedTime: new Date().toISOString(),
        }));
      },

      applyLoanToFunding: () => {
        const { loanCalculator } = get();

        set((state) => ({
          fundingPlan: {
            ...state.fundingPlan,
            bankLoans: {
              ...state.fundingPlan.bankLoans,
              mortgageLoan: loanCalculator.bankPrincipal,
              creditLoan: 0,
              otherLoan: 0,
            },
            otherBorrowing: loanCalculator.parentPrincipal,
          },
          lastUpdated: new Date().toISOString(),
          lastAppliedAction: 'loan->funding',
          lastAppliedTime: new Date().toISOString(),
        }));
      },

      clearAppliedAction: () => {
        set({ lastAppliedAction: null, lastAppliedTime: null });
      },

      resetAll: () => {
        set({
          fundingPlan: initialFundingPlan,
          loanCalculator: initialLoanCalculator,
          giftTaxCalculator: initialGiftTaxCalculator,
          lastUpdated: null,
          lastAppliedAction: null,
          lastAppliedTime: null,
        });
      },
    }),
    {
      name: 'naejib-calc-storage',
    }
  )
);

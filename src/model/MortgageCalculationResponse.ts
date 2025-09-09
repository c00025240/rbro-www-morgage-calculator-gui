import { Amount } from "./Amount";
import { InterestRateFormula } from "./InterestRateFormula";
import { InterestRateType } from "./InterestRateType";
import { LoanCosts } from "./LoanCosts";
import { MonthlyInstallment } from "./MonthlyInstallment";

export class MortgageCalculationResponse {
    interestRateType: InterestRateType; 
    nominalInterestRate: number;
    interestRateFormula: InterestRateFormula; 
    loanAmount: Amount; 
    maxAmount: Amount; 
    downPayment: Amount;
    loanAmountWithFee: Amount;
    housePrice: Amount;
    totalPaymentAmount: Amount;
    tenor: number;
    monthlyInstallment: MonthlyInstallment;
    loanCosts: LoanCosts;
    annualPercentageRate: number;
    noDocAmount: number;
    minGuaranteeAmount: number;
}

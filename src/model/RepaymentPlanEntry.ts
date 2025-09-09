import { Amount } from './Amount';

export class RepaymentPlanEntry {
    month: number;

    /**
     * An amount of the reimbursed capital for a month.
     * example: { "currency": "EUR", "amount": 123 }
     */
    reimbursedCapitalAmount: Amount;

    /**
     * An amount of the interest for a month.
     * example: { "currency": "EUR", "amount": 123 }
     */
    interestAmount: Amount;

    /**
     * An amount of fees for a month.
     * example: { "currency": "EUR", "amount": 123 }
     */
    feeAmount: Amount;

    /**
     * An amount of the monthly installment.
     * example: { "currency": "EUR", "amount": 123 }
     */
    installmentAmount: Amount;

    /**
     * An amount of the total payment for a month.
     * example: { "currency": "EUR", "amount": 123 }
     */
    totalPaymentAmount: Amount;
    remainingLoanAmount: Amount;

}

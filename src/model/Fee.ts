import { Frequency } from "./Frequency";

export class Fee {

    type: FeeType;
    fixedAmount: number;
    frequency: Frequency;

    }
    export enum FeeType {
        LOAN_APPROVAL,
        SUCCESSIVE_USAGE,
        UTILIZATION_PROLONGATION,
        PREMATURE_REPAYMENT,
        OTHER_CHANGES,
        CANCELLATION,
        UNUSED_LOAN_AMOUNT,
        REMINDER,
        COMMISSION,
        ADMINISTRATION,
        ACCOUNT,
        MANAGEMENT,
        REPAYMENT_PROLONGATION,
        PENALTY,
    }


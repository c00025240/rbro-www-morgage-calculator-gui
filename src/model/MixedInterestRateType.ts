import type { InterestRateType } from './InterestRateType';

export class MixedInterestRateType implements InterestRateType {
    type: MixedInterestType;
    interestRate: number;
    fixedPeriod: number;
}

export enum MixedInterestType {
    MIXED = 'MIXED',
}

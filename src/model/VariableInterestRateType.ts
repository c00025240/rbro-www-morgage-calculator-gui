import { InterestRateType } from "./InterestRateType";

export class VariableInterestRateType implements InterestRateType {

    type: Type;
    interestRate: number;
    }

    export enum Type {

        VARIABLE = "VARIABLE",
    }


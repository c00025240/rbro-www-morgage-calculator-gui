import { Fee } from "./Fee";
import { LifeInsurance } from "./LifeInsurance";
import { DiscountsValues } from "./DiscountsValues";
import { TotalDiscountsValues } from "./TotalDiscountsValues";

export interface LoanCosts {
    fees: Fee[];
    lifeInsurance: LifeInsurance[];
    discounts: DiscountsValues;
    totalDiscountsValues: TotalDiscountsValues;

}

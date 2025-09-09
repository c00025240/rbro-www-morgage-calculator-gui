import { Amount } from "./Amount";
import { Area } from "./Area";
import { Income } from "./Income";
import { InterestRateType } from "./InterestRateType";
import { InstallmentType } from "./InstallmentType";
import { SpecialOfferRequirements } from "./SpecialOfferRequirements";

export class MortgageCalculationRequest {
        productCode: string;
        loanAmount: Amount;
        area: Area;
        income: Income;
        tenor: number;
        age: number;
        owner: boolean;
        downPayment: number;
        interestRateType: InterestRateType;
        hasInsurance: boolean;
        installmentType: InstallmentType;
        specialOfferRequirements: SpecialOfferRequirements;
}

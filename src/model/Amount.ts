export class Amount {
  /**
   * ISO 4217 Alpha 3 currency code.
   * Example: "EUR"
   */
  currency: string;

  /**
   * The amount given with fractional digits, where fractions must be compliant to the currency definition.
   * Up to 14 significant figures. Negative amounts are signed by minus. The decimal separator is a dot.
   * Example: 5877.78
   */
  amount: number;
}


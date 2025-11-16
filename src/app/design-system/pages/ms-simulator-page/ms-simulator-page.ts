import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { MsPageShell } from '../../molecules/ms-page-shell/ms-page-shell';
import { MsHeader, HeaderAction } from '../../organisms/ms-header/ms-header';
import { MsSimulatorSwapHero } from '../../molecules/ms-simulator-swap-hero/ms-simulator-swap-hero';
import { MsPropertyValueInputComponent } from '../../molecules/ms-property-value-input/ms-property-value-input';
import { MsLoanDurationComponent } from '../../organisms/ms-loan-duration/ms-loan-duration';
import { MsIncomeSection } from '../../organisms/ms-income-section/ms-income-section';
import { MsAgeComponent } from '../../organisms/ms-age/ms-age';
import { MsPropertyLocationSection } from '../../organisms/ms-property-location-section/ms-property-location-section';
import { MsInterestPreferencesSection } from '../../organisms/ms-interest-preferences-section/ms-interest-preferences-section';
import { MsOwnerStatusComponent } from '../../organisms/ms-owner-status/ms-owner-status';
import { MsInterestReductionSection } from '../../organisms/ms-interest-reduction-section/ms-interest-reduction-section';
import { MsInfoContainedCell } from '../../molecules/ms-info-contained-cell/ms-info-contained-cell';
import { MsStickyFooter, StickyFooterActions } from '../../organisms/ms-sticky-footer/ms-sticky-footer';
import { AmountData } from '../../molecules/ms-amount-combo/ms-amount-combo';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsWebSummaryCard } from '../../organisms/ms-web-summary-card/ms-web-summary-card';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { SimulatorOptionModal } from '../../organisms/simulator-option-modal/simulator-option-modal';
import { MsDownpaymentComponent } from '../../molecules/ms-downpayment/ms-downpayment';
import { MsProgressSpinner } from '../../atoms/ms-progress-spinner/ms-progress-spinner';
import { MsMobileSummaryModalComponent } from '../../molecules/ms-mobile-summary-modal/ms-mobile-summary-modal';
import { MortgageCalculationService } from '../../../services/mortgage-calculation.service';
import { MortgageCalculationRequest } from '../../../../model/MortgageCalculationRequest';
import { MortgageCalculationResponse } from '../../../../model/MortgageCalculationResponse';
import { Amount } from '../../../../model/Amount';
import { Area } from '../../../../model/Area';
import { Income } from '../../../../model/Income';
import { SpecialOfferRequirements } from '../../../../model/SpecialOfferRequirements';
import { InstallmentType } from '../../../../model/InstallmentType';
import { District } from '../../../../model/District';

// Location option interface for dropdown options
export interface LocationOption {
  value: string;
  label: string;
}


export type SimulatorPageSurface = 'default' | 'light' | 'dark';

@Component({
  selector: 'ms-simulator-page',
  standalone: true,
  imports: [
    CommonModule,
    MsPageShell,
    MsHeader,
    MsSimulatorSwapHero,
    MsPropertyValueInputComponent,
    MsLoanDurationComponent,
    MsIncomeSection,
    MsAgeComponent,
    MsPropertyLocationSection,
    MsInterestPreferencesSection,
    MsOwnerStatusComponent,
    MsInterestReductionSection,
    MsInfoContainedCell,
    MsStickyFooter,
    MsCard,
    MsWebSummaryCard,
    MsCardOutsideTitleComponent,
    SimulatorOptionModal,
    MsDownpaymentComponent,
    MsProgressSpinner,
    MsMobileSummaryModalComponent
  ],
  templateUrl: './ms-simulator-page.html',
  styleUrls: ['./ms-simulator-page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsSimulatorPage implements OnInit, OnDestroy {
  // Page configuration (theme is global via data-theme)
  @HostBinding('class.ms-simulator-page') hostBaseClass: boolean = true;
  @Input() surface: SimulatorPageSurface = 'default';
  
  // Header configuration
  @Input() headerTitle: string = 'Simulator credit ipotecar';
  @Input() headerBackLabel: string = 'Înapoi';
  @Input() headerPrimaryAction?: HeaderAction;
  @Input() headerSecondaryAction?: HeaderAction;
  @Input() showHeaderBackButton: boolean = true;
  
  // Simulator hero configuration
  @Input() heroVariant: 'basic' | 'epic' = 'basic';
  @Input() heroLabel: string = 'Selectează tipul creditului';
  @Input() heroChipLabel: string = 'Achiziție imobil';
  @Input() heroHasClose: boolean = false;
  @Input() heroDisabled: boolean = false;
  @Input() selectedProductType: string = 'achizitie-imobil'; // Default product type
  
  // Property value input configuration
  @Input() propertyLabel: string = 'Valoarea proprietății';
  @Input() propertyHelperText: string = 'Valoarea totală a proprietății pe care dorești să o achiziționezi';
  @Input() propertyPlaceholder: string = '355000';
  @Input() propertyCurrency: string = 'Lei';
  @Input() propertyMin: number = 100000;
  @Input() propertyMax: number = 1000000;
  @Input() propertyStep: number = 5000;
  @Input() propertyEurConversionRate: number = 5.0;
  @Input() propertyDisabled: boolean = false;
  @Input() propertyValue: number = 330000; // Default property value per request
  
  // Loan duration input configuration
  @Input() loanDurationLabel: string = 'Perioada împrumutului';
  @Input() loanDurationPlaceholder: string = '30';
  @Input() loanDurationSuffix: string = 'ani';
  @Input() loanDurationMin: number = 1; // 1 an minimum
  @Input() loanDurationMax: number = 30; // 30 ani maximum
  @Input() loanDurationStep: number = 1; // 1 an increment
  @Input() loanDurationDisabled: boolean = false;
  @Input() loanDurationValue: number = 30; // Default loan duration (30 ani)
  
  // Age input configuration
  @Input() ageValue: number = 30; // Default age
  @Input() ageMin: number = 21;
  @Input() ageMax: number = 64;
  @Input() ageStep: number = 1;
  @Input() ageSuffix: string = 'ani';
  @Input() ageDisabled: boolean = false;
  
  // Income Section configuration
  @Input() monthlyIncome: number = 5500; // Default income per request
  @Input() monthlyInstallments: number = 0; // Default other installments per request
  
  // Down Payment Section configuration
  @Input() hasGuaranteeProperty: boolean = false;
  @Input() selectedGuaranteeValue: string = '240567';
  @Input() downPaymentAmount: number = 0;
  @Input() downPaymentDisabled: boolean = false; // Enabled by default
  downPaymentInfoNote?: string; // Note about additional amount needed for discount
  downPaymentInfoType?: 'info' | 'success'; // Type of info note for styling
  downPaymentTooLow: boolean = false; // Error state for down payment validation
  downPaymentErrorMessage?: string; // Error message for down payment validation
  
  // Property Location Section configuration
  @Input() selectedCounty: string = 'BUCURESTI';
  @Input() selectedCity: string = 'BUCURESTI';
  
  // Districts data for location dropdowns
  districts: District[] = [];
  counties: string[] = [];
  cities: string[] = [];
  isLoadingDistricts: boolean = false;

  // Getters for location dropdown options
  get countyOptions(): LocationOption[] {
    const options = this.counties.map(county => ({
      value: county,
      label: county
    }));

    return options;
  }

  get cityOptions(): LocationOption[] {
    const options = this.cities.map(city => ({
      value: city,
      label: city
    }));

    return options;
  }
  
  // Interest Preferences Section configuration
  @Input() rateType: string = 'egale';
  @Input() interestType: string = 'fixa_3';
  
  // Interest Reduction Section configuration
  @Input() lifeInsurance: boolean = true;
  @Input() salaryTransfer: boolean = true;
  @Input() greenCertificate: boolean = true;
  
  // Info Cell configuration - calculated automatically
  get requestedAmount(): number {
    return this.calculateLoanAmount();
  }
  
  // Summary calculated values (for right panel display)
  @Input() estimatedMonthlyPayment: number = 2850;
  
  // Summary card outside title configuration
  @Input() summaryTitle: string = 'Oferta ta';
  @Input() summaryHelperText: string = 'ofertă orientativă, calculată în baza datelor introduse de tine';
  
  // Sticky footer configuration (mobile/tablet only)
  @Input() footerLeftAmount?: AmountData;
  @Input() footerRightAmount?: AmountData;
  @Input() footerActions?: StickyFooterActions;

  // Mobile summary modal state
  isMobileSummaryVisible: boolean = false;
  // No UI toggles; inputs should reinitialize via bound values
  
  // Simulator Option Modal state
  isSimulatorModalVisible: boolean = false;
  
  // Form data and calculation state
  private destroy$ = new Subject<void>();
  private formDataSubject = new Subject<void>();
  private lastFormDataHash: string = '';
  private lastIsFormValid: boolean = true;
  isLoading: boolean = false;
  calculationResponse?: MortgageCalculationResponse;
  calculationResponseAllDiscounts?: MortgageCalculationResponse;
  calculationResponseNoDiscounts?: MortgageCalculationResponse;
  errorMessage?: string;
  // Flag to show error banner inside the offers card when personalized offer fails
  showOffersErrorBanner: boolean = false;
  // Track whether user changed at least one input; if false, we show only two offers
  private hasUserInteracted: boolean = false;
  private readonly STORAGE_SELECTED_PRODUCT_KEY = 'ms-sim-selectedProductType';
  private readonly STORAGE_FORM_STATE_KEY = 'ms-sim-form-state-v1';
  
  // Form validation state
  isFormValid: boolean = true;
  
  constructor(private mortgageService: MortgageCalculationService, private cdr: ChangeDetectorRef) {

  }
  
  ngOnInit(): void {
    // Do not restore any state from localStorage; start with defaults
    
    // Load districts data from API (will replace test data when successful)
    this.loadDistricts();
    
    // Initialize default down payment based on product type
    this.downPaymentAmount = this.computeDefaultDownPaymentAmount();
    
    // Initialize max loan duration based on default age
    this.updateMaxLoanDurationBasedOnAge();
    
    // Set up form data change detection with smart debouncing to avoid multiple API calls
    this.formDataSubject
      .pipe(
        debounceTime(400), // Faster feedback on user input
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const currentFormDataHash = this.getFormDataHash();

        // Always re-validate to detect transitions invalid -> valid
        this.validateForm();

        const becameValid = !this.lastIsFormValid && this.isFormValid;
        const changedData = currentFormDataHash !== this.lastFormDataHash;

        // Update snapshots for next tick
        this.lastFormDataHash = currentFormDataHash;
        this.lastIsFormValid = this.isFormValid;

        if (this.isFormValid && (changedData || becameValid)) {
          console.log('✅ Form is valid and changed (or became valid), calculating mortgage...');
          this.calculateMortgage();
        } else if (!this.isFormValid) {
          console.log('❌ Form is not valid, skipping calculation');
        } else {
          console.log('🔄 Form valid but unchanged, skipping calculation');
        }
      });
    
    // Trigger initial validation with default values
    console.log('🚀 Initial form validation triggered');
    this.triggerFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Event outputs
  @Output() headerBackClicked = new EventEmitter<MouseEvent>();
  @Output() headerPrimaryActionClicked = new EventEmitter<MouseEvent>();
  @Output() headerSecondaryActionClicked = new EventEmitter<MouseEvent>();
  @Output() headerLogoClicked = new EventEmitter<MouseEvent>();
  
  @Output() heroChipClicked = new EventEmitter<void>();
  @Output() heroCloseClicked = new EventEmitter<void>();
  
  @Output() propertyValueChange = new EventEmitter<number>();
  @Output() propertyFocused = new EventEmitter<FocusEvent>();
  @Output() propertyBlurred = new EventEmitter<FocusEvent>();
  
  @Output() loanDurationValueChange = new EventEmitter<number>();
  @Output() loanDurationFocused = new EventEmitter<FocusEvent>();
  @Output() loanDurationBlurred = new EventEmitter<FocusEvent>();
  @Output() ageValueChange = new EventEmitter<number>();
  
  // Income Section events
  @Output() monthlyIncomeChange = new EventEmitter<number>();
  @Output() monthlyInstallmentsChange = new EventEmitter<number>();
  
  // Down Payment Section events
  @Output() guaranteePropertyChange = new EventEmitter<boolean>();
  @Output() guaranteeValueChange = new EventEmitter<string>();
  @Output() downPaymentAmountChange = new EventEmitter<number>();
  
  // Property Location Section events
  @Output() countyChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();
  
  // Interest Preferences Section events
  @Output() rateTypeChange = new EventEmitter<string>();
  @Output() interestTypeChange = new EventEmitter<string>();
  
  // Interest Reduction Section events
  @Output() lifeInsuranceChange = new EventEmitter<boolean>();
  @Output() salaryTransferChange = new EventEmitter<boolean>();
  @Output() greenCertificateChange = new EventEmitter<boolean>();
  
  @Output() footerDetailsClicked = new EventEmitter<MouseEvent>();
  @Output() footerPrimaryClicked = new EventEmitter<MouseEvent>();
  @Output() footerShareClicked = new EventEmitter<MouseEvent>();
  
  // Simulator Option Modal events
  @Output() simulatorOptionSelected = new EventEmitter<string>();

  // Form validation and calculation methods
  private updateMaxLoanDurationBasedOnAge(): void {
    const MAX_AGE_AT_LOAN_END = 65; // Varsta maxima pana la care pot avea credit
    const ABSOLUTE_MAX_LOAN_DURATION = 30; // Perioada maxima absoluta in ani
    
    if (typeof this.ageValue === 'number' && this.ageValue > 0) {
      // Calculeaza perioada maxima: min(30 ani, 65 - varsta_curenta)
      const yearsUntilMaxAge = MAX_AGE_AT_LOAN_END - this.ageValue;
      const calculatedMax = Math.max(1, Math.min(ABSOLUTE_MAX_LOAN_DURATION, yearsUntilMaxAge));
      
      this.loanDurationMax = calculatedMax;
      
      // Daca valoarea curenta depaseste noul maxim, ajusteaza-o
      if (this.loanDurationValue > calculatedMax) {
        this.loanDurationValue = calculatedMax;
      }
      
      console.log(`📅 Varsta: ${this.ageValue} ani → Perioada max: ${calculatedMax} ani`);
    }
  }
  
  private validateForm(): void {
    const isPropertyValid = typeof this.propertyValue === 'number'
      && this.propertyValue >= this.propertyMin
      && this.propertyValue <= this.propertyMax;

    const isLoanDurationValid = typeof this.loanDurationValue === 'number'
      && this.loanDurationValue >= this.loanDurationMin
      && this.loanDurationValue <= this.loanDurationMax;

    const isAgeValid = typeof this.ageValue === 'number'
      && this.ageValue >= this.ageMin
      && this.ageValue <= this.ageMax;

    const isIncomeValid = typeof this.monthlyIncome === 'number' && this.monthlyIncome > 0;

    const hasLocation = !!(this.selectedCounty && this.selectedCity);
    const hasRates = !!(this.rateType && this.interestType);

    this.isFormValid = !!(
      isPropertyValid &&
      isLoanDurationValid &&
      isAgeValid &&
      isIncomeValid &&
      hasLocation &&
      hasRates
      // downPaymentAmount is not required for validation since it's disabled initially
    );
    
    // Trigger change detection after validation
    this.cdr.markForCheck();
  }
  
  private createMortgageRequest(): MortgageCalculationRequest {
    const request = new MortgageCalculationRequest();
    
    // Basic loan information
    request.productCode = this.mapProductTypeToCode(this.selectedProductType);
    request.tenor = this.loanDurationValue || 0;
    request.age = this.ageValue || 30;
    request.owner = this.hasGuaranteeProperty; // Use guarantee property as owner indicator
    request.downPayment = this.downPaymentAmount; // Use the current down payment amount
    request.hasInsurance = this.lifeInsurance;
    
    // Loan amount - calculated from property value minus down payment
    request.loanAmount = new Amount();
    request.loanAmount.currency = 'RON';
    request.loanAmount.amount = this.propertyValue;
    
    // Area information
    request.area = new Area();
    request.area.city = this.selectedCity;
    request.area.county = this.selectedCounty;
    
    // Income information
    request.income = new Income();
    request.income.currentIncome = this.monthlyIncome;
    request.income.otherInstallments = this.monthlyInstallments;
    
    // Interest rate type (you'll need to map the string values to the proper enum/interface)
    request.interestRateType = this.mapInterestRateType();
    
    // Installment type
    request.installmentType = this.rateType === 'egale' ? InstallmentType.EQUAL_INSTALLMENTS : InstallmentType.DECREASING_INSTALLMENTS;
    
    // Special offer requirements
    request.specialOfferRequirements = new SpecialOfferRequirements();
    request.specialOfferRequirements.hasSalaryInTheBank = this.salaryTransfer;
    // Casa Verde discount is not available for construction/renovation
    request.specialOfferRequirements.casaVerde = this.selectedProductType === 'constructie-renovare' ? false : this.greenCertificate;
    
    return request;
  }
  
  private calculateDownPayment(): number {
    // Calculate down payment as percentage of property value
    // This is a simplified calculation - you might want to make this configurable
    return (this.propertyValue || 0) * 0.2; // 20% down payment
  }
  
  private calculateLoanAmount(): number {
    // Calculate loan amount as property value minus down payment
    return (this.propertyValue || 0) - this.downPaymentAmount;
  }
  
  private mapInterestRateType(): any {
    // Map the interest type string to the proper InterestRateType
    // Backend accepts: MIXED, VARIABLE 
    let backendType = 'VARIABLE'; // default
    let backendValue = undefined;
    if (this.interestType === 'fixa_3') {
      backendType = 'MIXED';
      backendValue = 3;
    } else if (this.interestType === 'fixa_5') {
      backendType = 'MIXED';
      backendValue = 5;
    } else if (this.interestType === 'variabila') {
      backendType = 'VARIABLE';
    }
    
    return {
      type: backendType,
      fixedPeriod: backendValue
    };
  }
  
  private mapProductTypeToCode(productType: string): string {
    // Map the selected product type to the corresponding product code
    switch (productType) {
      case 'achizitie-imobil':
        return 'CasaTa';
      case 'refinantare':
        return 'FlexiIntegral';
      case 'constructie-renovare':
        return 'Constructie';
      case 'credit-venit':
        return 'CreditVenit';
      default:
        return 'casaTa'; // Default fallback
    }
  }
  
  private calculateMortgage(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.showOffersErrorBanner = false;
    this.cdr.markForCheck(); // Trigger change detection to show loading spinner

    // Use setTimeout to ensure loading spinner is visible before starting API calls
    // This allows the UI to update in the current change detection cycle
    setTimeout(() => {
      const baseRequest = this.createMortgageRequest();
      // Make all 3 calls in parallel
      this.calculateAllVariants(baseRequest);
    }, 0);
  }

  private calculateAllVariants(baseRequest: MortgageCalculationRequest): void {
    // Call 1: Current user settings (base request)
    this.mortgageService.calculateMortgage(baseRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.calculationResponse = response;
          
          // NOTE: Perioada maxima este acum calculata bazat pe varsta utilizatorului
          // Nu mai actualizam loanDurationMax din raspunsul backend (tenor)

          // Update down payment amount from backend response
          if (response.downPayment && response.downPayment.amount) {
            this.downPaymentAmount = response.downPayment.amount;
          }

          // Populate sticky footer (tablet) amounts and actions
          // Use correct installment amount based on interest type
          const installmentAmount = this.interestType === 'variabila' 
            ? (response.monthlyInstallment?.amountVariableInterest || 0)
            : (response.monthlyInstallment?.amountFixedInterest || 0);
          
          this.footerLeftAmount = {
            label: this.interestType === 'variabila' ? 'Rata lunară variabilă' : 'Prima rată fixă',
            amount: installmentAmount.toFixed(2),
            currency: 'Lei/lună'
          };
          this.footerRightAmount = {
            label: 'Suma totală',
            amount: (response.totalPaymentAmount?.amount || 0).toFixed(2),
            currency: 'Lei'
          };
          this.footerActions = {
            primary: { label: 'Aplică' },
            details: { label: 'Detalii' },
            share: { ariaLabel: 'Distribuie oferta' }
          };
          
          // Update down payment info note from backend response
          this.updateDownPaymentInfoNote(response);

          this.isLoading = false;
          this.errorMessage = undefined; // clear any previous error (e.g., 422)
          this.showOffersErrorBanner = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
 					if (error?.status === 422) {
 						const msg = error?.error?.reasons?.[0]?.message ?? error?.error?.message ?? error?.message;
 						this.errorMessage = msg || 'Ne pare rău! Cererea nu poate fi procesată.';
 					} else {
 						this.errorMessage = error?.message || 'A apărut o eroare la calcularea creditului. Vă rugăm să încercați din nou.';
 					}
 					this.isLoading = false;
          // In any error case for personalized offer, flip the banner flag on
          this.showOffersErrorBanner = true;
 					console.error('Mortgage calculation error:', error);
 					this.cdr.markForCheck();
 				}
      });

    // Call 2: All discounts true
    const reqAll: MortgageCalculationRequest = JSON.parse(JSON.stringify(baseRequest));
    reqAll.hasInsurance = true;
    reqAll.specialOfferRequirements = reqAll.specialOfferRequirements || new SpecialOfferRequirements();
    reqAll.specialOfferRequirements.hasSalaryInTheBank = true;
    // Casa Verde discount is not available for construction/renovation
    reqAll.specialOfferRequirements.casaVerde = this.selectedProductType === 'constructie-renovare' ? false : true;
    // For the "all discounts" offer down payment logic:
    // - Refinantare: avans 0
    // - Constructie/renovare: foloseste avansul introdus de client
    // - Alte produse: daca userul a interactionat si avansul introdus > 20%, foloseste avansul introdus; altfel 20%
    if (this.selectedProductType === 'refinantare') {
      reqAll.downPayment = 0;
    } else if (this.selectedProductType === 'constructie-renovare') {
      reqAll.downPayment = this.downPaymentAmount || 0;
    } else {
      const twentyPercent = Math.round((this.propertyValue || 0) * 0.20);
      const userDownPayment = this.downPaymentAmount || 0;
      reqAll.downPayment = (this.hasUserInteracted && userDownPayment > twentyPercent)
        ? userDownPayment
        : twentyPercent;
    }
    this.mortgageService.calculateMortgage(reqAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ 
        next: r => {
          this.calculationResponseAllDiscounts = r;
          this.cdr.markForCheck();
        }, 
        error: () => { 
          // Hide the "all discounts" card on error
          this.calculationResponseAllDiscounts = undefined;
          this.cdr.markForCheck();
        } 
      });

    // Call 3: All discounts false (only after user interacts with inputs)
    const reqNone: MortgageCalculationRequest = JSON.parse(JSON.stringify(baseRequest));
    reqNone.hasInsurance = false;
    reqNone.specialOfferRequirements = reqNone.specialOfferRequirements || new SpecialOfferRequirements();
    reqNone.specialOfferRequirements.hasSalaryInTheBank = false;
    reqNone.specialOfferRequirements.casaVerde = false;
    // For the "no discounts" offer down payment logic (fixed per product type):
    // - Refinantare: 0
    // - Constructie/renovare: 500
    // - Casa ta (achizitie-imobil) si Credit in functie de venit: 15% din valoarea proprietatii
    if (this.selectedProductType === 'refinantare') {
      reqNone.downPayment = 0;
    } else if (this.selectedProductType === 'constructie-renovare') {
      reqNone.downPayment = 500;
    } else {
      // For 'achizitie-imobil' and 'credit-venit': 15% of property value
      reqNone.downPayment = Math.round((this.propertyValue || 0) * 0.15);
    }
    if (this.hasUserInteracted) {
      this.mortgageService.calculateMortgage(reqNone)
        .pipe(takeUntil(this.destroy$))
        .subscribe({ 
          next: r => {
            this.calculationResponseNoDiscounts = r;
            this.cdr.markForCheck();
          }, 
          error: () => { 
            // Hide the "no discounts" card on error
            this.calculationResponseNoDiscounts = undefined;
            this.cdr.markForCheck();
          } 
        });
    } else {
      // Ensure it's hidden on initial default view
      this.calculationResponseNoDiscounts = undefined;
    }
  }
  
  private triggerFormValidation(): void {
    console.log('🚀 Triggering form validation...');
    this.formDataSubject.next();
  }

  private getFormDataHash(): string {
    // Create a hash of all form data to detect real changes
    const formData = {
      propertyValue: this.propertyValue,
      loanDurationValue: this.loanDurationValue,
      ageValue: this.ageValue,
      monthlyIncome: this.monthlyIncome,
      monthlyInstallments: this.monthlyInstallments,
      hasGuaranteeProperty: this.hasGuaranteeProperty,
      selectedGuaranteeValue: this.selectedGuaranteeValue,
      downPaymentAmount: this.downPaymentAmount,
      selectedCounty: this.selectedCounty,
      selectedCity: this.selectedCity,
      rateType: this.rateType,
      interestType: this.interestType,
      lifeInsurance: this.lifeInsurance,
      salaryTransfer: this.salaryTransfer,
      greenCertificate: this.greenCertificate,
      selectedProductType: this.selectedProductType
    };
    
    return JSON.stringify(formData);
  }

  // Districts and location methods
  private loadDistricts(): void {
    this.isLoadingDistricts = true;
    
    this.mortgageService.getDistricts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          console.log('✅ Districts loaded successfully:', districts);
          this.districts = districts;
          this.updateLocationDropdowns();
          this.isLoadingDistricts = false;
        },
        error: (error) => {
          console.error('❌ Error loading districts:', error);
          this.isLoadingDistricts = false;
          
          // Fallback to default values on error
          this.districts = [
            { city: 'BUCURESTI', county: 'BUCURESTI' }
          ];
          this.updateLocationDropdowns();
        }
      });
  }
  
  private updateLocationDropdowns(): void {
    // Extract unique counties from API data
    this.counties = [...new Set(this.districts.map(d => d.county))].sort();
    console.log('📍 Counties updated from API:', this.counties);
    
    // Update cities based on selected county
    this.updateCitiesForCounty(this.selectedCounty);
    console.log('🏙️ Cities updated for county', this.selectedCounty, ':', this.cities);
    
    // Force change detection
    this.cdr.markForCheck();
  }
  
  private updateCitiesForCounty(county: string): void {
    const filteredDistricts = this.districts.filter(d => d.county === county);
    this.cities = filteredDistricts.map(d => d.city).sort();
    
    console.log(`🏙️ Updating cities for county "${county}":`, {
      allDistricts: this.districts.length,
      filteredDistricts: filteredDistricts.length,
      cities: this.cities
    });
    
    // If no cities found for selected county, use all available cities as fallback
    if (this.cities.length === 0 && this.districts.length > 0) {
      this.cities = [...new Set(this.districts.map(d => d.city))].sort();
      console.log('⚠️ No cities found for county, using all cities as fallback:', this.cities);
    }
  }


  // Event handlers
  onHeaderBackClick(event: MouseEvent): void { this.headerBackClicked.emit(event); }
  onHeaderPrimaryActionClick(event: MouseEvent): void { this.headerPrimaryActionClicked.emit(event); }
  onHeaderSecondaryActionClick(event: MouseEvent): void { this.headerSecondaryActionClicked.emit(event); }
  onHeaderLogoClick(event: MouseEvent): void { 
    // Track logo click for analytics
    this.trackEvent('Logo Click', 'Raiffeisen Bank Logo');
    this.headerLogoClicked.emit(event); 
  }
  onHeroChipClick(): void { 
    console.log('🎯 Hero chip clicked! Opening simulator modal...');
    this.isSimulatorModalVisible = true;
    console.log('📱 Modal visibility set to:', this.isSimulatorModalVisible);
    
    // Force change detection to ensure modal shows
    this.cdr.markForCheck();
    
    this.heroChipClicked.emit(); 
  }
  onHeroCloseClick(): void { this.heroCloseClicked.emit(); }
  onPropertyValueChange(value: number): void { 
    this.markInteracted();
    this.propertyValue = value;
    
    // Re-validate down payment when property value changes
    this.validateDownPayment();
    
    this.propertyValueChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onPropertyFocused(event: FocusEvent): void { 
    this.propertyFocused.emit(event);
    // Don't trigger validation on focus - wait for user to finish typing
  }
  onPropertyBlurred(event: FocusEvent): void { 
    this.propertyBlurred.emit(event);
    // Trigger validation immediately on blur (user finished typing)
    this.triggerFormValidation();
  }
  onLoanDurationValueChange(value: number): void { 
    this.markInteracted();
    this.loanDurationValue = value;
    this.loanDurationValueChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onLoanDurationFocused(event: FocusEvent): void { 
    this.loanDurationFocused.emit(event);
    // Don't trigger validation on focus - wait for user to finish typing
  }
  onLoanDurationBlurred(event: FocusEvent): void { 
    this.loanDurationBlurred.emit(event);
    // Trigger validation immediately on blur (user finished typing)
    this.triggerFormValidation();
  }
  onAgeValueChange(value: number): void {
    this.markInteracted();
    this.ageValue = value;
    
    // Update max loan duration based on age
    this.updateMaxLoanDurationBasedOnAge();
    
    // Track age change
    this.trackEvent('Varsta Modificata', `${value} ani`, value);
    
    this.ageValueChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onFooterDetailsClick(event: MouseEvent): void {
    // Track "Detalii ofertă" button click
    this.trackEvent('Buton Detalii Click', 'Detalii ofertă', this.requestedAmount);
    
    this.footerDetailsClicked.emit(event);
    const isMobileOrTablet = typeof window !== 'undefined' && window.matchMedia('(max-width: 1239px)').matches;
    if (isMobileOrTablet) {
      this.isMobileSummaryVisible = true;
      this.cdr.markForCheck();
    }
  }
  onMobileSummaryClosed(): void {
    this.isMobileSummaryVisible = false;
    this.cdr.markForCheck();
  }

  onMobileApplyClick(): void {
    // Track "Aplică" button click from mobile modal
    this.trackEvent('Buton Aplica Mobile Click', 'Aplica din modal', this.requestedAmount);
  }

  getMobileOffers(): Array<{
    title: string;
    monthlyInstallment: string;
    fixedRate: string;
    variableRate: string;
    variableInstallment: string;
    dae: string;
    installmentType: string;
    downPayment: string;
    loanAmount: string;
    totalAmount: string;
    noDocAmount?: string;
    housePriceMin?: string;
    downPaymentInfoNote?: string;
    interestType?: string;
    productType?: string;
  }> {
    const out: Array<{ title: string; monthlyInstallment: string; fixedRate: string; variableRate: string; variableInstallment: string; dae: string; installmentType: string; downPayment: string; loanAmount: string; totalAmount: string; noDocAmount?: string; housePriceMin?: string; downPaymentInfoNote?: string; interestType?: string; productType?: string; }> = [];

    const responses = [
      { resp: this.calculationResponse, title: 'Oferta ta personalizată' },
      { resp: this.calculationResponseAllDiscounts, title: 'Cu toate reducerile' },
      { resp: this.calculationResponseNoDiscounts, title: 'Fără reduceri' }
    ];

    // Initially: only first two offers (personalizata + all discounts)
    const limit = this.hasUserInteracted ? responses.length : 2;

    for (let i = 0; i < limit; i++) {
      const r = responses[i];
      if (!r.resp) continue; // skip missing variants, no fallback
      let noDocStr: string | undefined;
      let housePriceStr: string | undefined;
      const noDoc = (r.resp?.noDocAmount) as number | undefined;
      const minGuarantee = r.resp?.minGuaranteeAmount as number | undefined;
      const gapRaw = (r.resp as any)?.downPaymentDiscountGap;
      const gap = typeof gapRaw === 'number' ? gapRaw as number : undefined;
      let downPaymentInfoNote: string | undefined;
      if (this.selectedProductType === 'constructie-renovare') {
        if (typeof noDoc === 'number') noDocStr = (noDoc || 0).toFixed(2) + ' Lei';
        if (typeof minGuarantee === 'number') housePriceStr = (minGuarantee || 0).toFixed(2) + ' Lei';
      } else if (this.selectedProductType === 'refinantare') {
        if (typeof minGuarantee === 'number') housePriceStr = (minGuarantee || 0).toFixed(2) + ' Lei';
      }
      // Note: downPaymentInfoNote is now displayed in the down payment input component
      // No longer needed in summary cards
      out.push({
        title: r.title,
        // Use correct installment amount based on interest type
        monthlyInstallment: this.interestType === 'variabila'
          ? ((r.resp.monthlyInstallment?.amountVariableInterest) || 0).toFixed(2) + ' Lei'
          : ((r.resp.monthlyInstallment?.amountFixedInterest) || 0).toFixed(2) + ' Lei',
        fixedRate: (r.resp.nominalInterestRate || 0).toFixed(2) + '%',
        variableRate: ((r.resp.interestRateFormula?.bankMarginRate || 0) + (r.resp.interestRateFormula?.irccRate || 0)).toFixed(2) + '%',
        variableInstallment: ((r.resp.monthlyInstallment?.amountVariableInterest) || 0).toFixed(2) + ' Lei',
        dae: (r.resp.annualPercentageRate || 0).toFixed(2) + '%',
        installmentType: (this.rateType === 'egale') ? 'Rate egale' : 'Rate descrescatoare',
        downPayment: ((r.resp.downPayment?.amount) || 0).toFixed(2) + ' Lei',
        loanAmount: ((r.resp.loanAmount?.amount) || 0).toFixed(2) + ' Lei',
        totalAmount: ((r.resp.totalPaymentAmount?.amount) || 0).toFixed(2) + ' Lei',
        noDocAmount: noDocStr,
        housePriceMin: housePriceStr,
        interestType: this.interestType,
        productType: this.selectedProductType
      });
    }

    return out;
  }
  onFooterPrimaryClick(event: MouseEvent): void { 
    // Track "Aplică" button click
    this.trackEvent('Buton Aplică Click', 'Aplică în doar 2 minute', this.requestedAmount);
    this.footerPrimaryClicked.emit(event); 
  }
  onFooterShareClick(event: MouseEvent): void { this.footerShareClicked.emit(event); }
  // Income Section event handlers
  onMonthlyIncomeChange(value: number): void { 
    this.markInteracted();
    this.monthlyIncome = value;
    this.monthlyIncomeChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onMonthlyInstallmentsChange(value: number): void { 
    this.markInteracted();
    this.monthlyInstallments = value;
    this.monthlyInstallmentsChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  // Down Payment Section event handlers
  onGuaranteePropertyChange(value: boolean): void { 
    this.markInteracted();
    this.hasGuaranteeProperty = value;
    
    // Track owner/guarantee property change
    this.trackEvent('Owner Status Modificat', value ? 'Cu garantie imobil' : 'Fara garantie imobil', value ? 1 : 0);
    
    this.guaranteePropertyChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onGuaranteeValueChange(value: string): void { 
    this.markInteracted();
    this.selectedGuaranteeValue = value;
    this.guaranteeValueChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onDownPaymentAmountChange(value: number): void { 
    this.markInteracted();
    this.downPaymentAmount = value;
    
    // Validate down payment
    this.validateDownPayment();
    
    this.downPaymentAmountChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  
  private validateDownPayment(): void {
    // Validate down payment for Casa Ta and Credit in functie de venit
    if (this.selectedProductType === 'achizitie-imobil' || this.selectedProductType === 'credit-venit') {
      const minDownPayment = Math.round((this.propertyValue || 0) * 0.15);
      if (this.downPaymentAmount > 0 && this.downPaymentAmount < minDownPayment) {
        this.downPaymentTooLow = true;
        this.downPaymentErrorMessage = `Avansul completat este prea mic. Pentru acest credit îți recomandăm un avans de minim ${minDownPayment.toLocaleString('ro-RO')} Lei`;
      } else {
        this.downPaymentTooLow = false;
        this.downPaymentErrorMessage = undefined;
      }
    } else {
      // No validation for other product types
      this.downPaymentTooLow = false;
      this.downPaymentErrorMessage = undefined;
    }
  }
  // Property Location Section event handlers
  onCountyChange(value: string): void { 
    console.log(`🏛️ County changed from "${this.selectedCounty}" to "${value}"`);
    this.markInteracted();
    
    this.selectedCounty = value;
    this.updateCitiesForCounty(value);
    
    // Track county selection
    this.trackEvent('Judet Selectat', value);
    
    // Reset city selection if current city is not available in new county
    const previousCity = this.selectedCity;
    if (!this.cities.includes(this.selectedCity)) {
      this.selectedCity = this.cities[0] || '';
      console.log(`🔄 City reset from "${previousCity}" to "${this.selectedCity}" (cities available: ${this.cities.length})`);
    }
    
    // Force change detection to update the UI
    this.cdr.markForCheck();
    
    this.countyChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onCityChange(value: string): void { 
    this.markInteracted();
    this.selectedCity = value;
    
    // Track city selection
    this.trackEvent('Oras Selectat', `${this.selectedCounty} - ${value}`);
    
    this.cityChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  // Interest Preferences Section event handlers
  onRateTypeChange(value: string): void { 
    this.markInteracted();
    this.rateType = value;
    this.rateTypeChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onInterestTypeChange(value: string): void { 
    this.markInteracted();
    this.interestType = value;
    this.interestTypeChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  // Interest Reduction Section event handlers
  onLifeInsuranceChange(value: boolean): void { 
    this.markInteracted();
    this.lifeInsurance = value;
    this.lifeInsuranceChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onSalaryTransferChange(value: boolean): void { 
    this.markInteracted();
    this.salaryTransfer = value;
    
    // Track salary transfer (client type indicator)
    this.trackEvent('Tip Client - Incasare Salariu', value ? 'Client cu salariu la Raiffeisen' : 'Client fara salariu la Raiffeisen', value ? 1 : 0);
    
    this.salaryTransferChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  onGreenCertificateChange(value: boolean): void { 
    this.markInteracted();
    this.greenCertificate = value;
    this.greenCertificateChange.emit(value);
    this.cdr.markForCheck();
    this.triggerFormValidation();
  }
  
  // Simulator Option Modal event handlers
  onSimulatorModalClose(): void {
    console.log('❌ Simulator modal closed');
    this.isSimulatorModalVisible = false;
    this.cdr.markForCheck();
  }
  
  onSimulatorOptionSelected(optionId: string): void {
    console.log('✅ Simulator option selected:', optionId);
    
    // Update the selected product type (do not persist state on switch)
    const previousProductType = this.selectedProductType;
    this.applyProductType(optionId, false);
    
    // Track product type selection
    this.trackEvent('Tip Credit Selectat', this.heroChipLabel, optionId);
    
    // Keep for logging purposes
    const previousChipLabel = this.heroChipLabel;
    
    console.log('🔄 Product type changed:', {
      from: previousProductType,
      to: this.selectedProductType,
      chipLabelFrom: previousChipLabel,
      chipLabelTo: this.heroChipLabel
    });
    
    // Close the modal
    this.isSimulatorModalVisible = false;
    
    // Force change detection to update UI
    this.cdr.markForCheck();
    
    // Trigger form validation to recalculate with new product type
    this.triggerFormValidation();
    
    // Emit the selection event for parent components
    this.simulatorOptionSelected.emit(optionId);
  }

  private applyProductType(optionId: string, persist: boolean): void {
    this.selectedProductType = optionId;
    switch (optionId) {
      case 'achizitie-imobil':
        this.heroChipLabel = 'Achiziție imobil';
        break;
      case 'refinantare':
        this.heroChipLabel = 'Refinanțare';
        break;
      case 'constructie-renovare':
        this.heroChipLabel = 'Construcție/renovare';
        break;
      case 'credit-venit':
        this.heroChipLabel = 'Credit în funcție de venit';
        break;
      default:
        this.heroChipLabel = 'Achiziție imobil';
    }

    // Reset inputs to defaults for new credit type
    this.propertyValue = 330000;
    this.loanDurationValue = 30;
    this.ageValue = 30;
    this.monthlyIncome = 5500;
    this.monthlyInstallments = 0;
    this.hasGuaranteeProperty = false;
    this.downPaymentAmount = 0;
    this.selectedCounty = 'BUCURESTI';
    this.selectedCity = 'BUCURESTI';
    this.rateType = 'egale';
    this.interestType = 'fixa_3';
    this.lifeInsurance = true;
    this.salaryTransfer = true;
    this.greenCertificate = true;

    // Recalculate max loan duration based on reset age
    this.updateMaxLoanDurationBasedOnAge();

    // Set default down payment per product type
    this.downPaymentAmount = this.computeDefaultDownPaymentAmount();
    
    // Validate down payment for new product type
    this.validateDownPayment();

    // Show only two offers until user interacts
    this.hasUserInteracted = false;
    this.calculationResponseNoDiscounts = undefined;

    // Reset location to Bucuresti if available in loaded districts; otherwise keep first
    if (this.counties.length > 0) {
      this.selectedCounty = this.counties.includes('BUCURESTI') ? 'BUCURESTI' : (this.counties[0] || this.selectedCounty);
      this.updateCitiesForCounty(this.selectedCounty);
      this.selectedCity = this.cities.includes('BUCURESTI') ? 'BUCURESTI' : (this.cities[0] || this.selectedCity);
    }

    // Do not persist form or product type state when switching credit type
    // Clear any previously saved state to ensure defaults are used
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(this.STORAGE_FORM_STATE_KEY);
        window.localStorage.removeItem(this.STORAGE_SELECTED_PRODUCT_KEY);
      } catch {}
    }

    // Trigger recalculation with defaults
    this.triggerFormValidation();
  }

  private computeDefaultDownPaymentAmount(): number {
    // Constructie/renovare: 500 lei fix; Refinantare: 0; Restul: 15% din valoarea proprietatii
    if (this.selectedProductType === 'constructie-renovare') {
      return 500;
    }
    if (this.selectedProductType === 'refinantare') {
      return 0;
    }
    const base = Number(this.propertyValue) || 0;
    return Math.round(base * 0.15);
  }

  private updateDownPaymentInfoNote(response: MortgageCalculationResponse): void {
    if (this.selectedProductType === 'constructie-renovare') {
      // For construction/renovation - check gap to determine message type
      const gapRaw = (response as any)?.downPaymentDiscountGap;
      const gap = typeof gapRaw === 'number' ? gapRaw as number : undefined;
      const housePrice = (response?.housePrice?.amount ?? response?.housePrice) as number | undefined;
      const discountAmount = response?.loanCosts?.discounts?.discountAmountDownPayment || 0;
      
      if (gap !== undefined && gap < 0) {
        // Success message when gap is negative - user already has the discount
        this.downPaymentInfoNote = 'Imobilul adus in garantie iti aduce o reducere a ratei lunare de 0,2% din dobanda standard.';
        this.downPaymentInfoType = 'success';
      } else {
        // Info message when gap is 0 or positive - show details about housePrice and discount
        if (housePrice !== undefined && housePrice > 0) {
          const housePriceStr = housePrice.toFixed(2);
          const discountStr = discountAmount.toFixed(2);
          this.downPaymentInfoNote = `Daca imobilul adus in garantie va fi evaluat la minim ${housePriceStr} Lei vei beneficia de o reducere a ratei in valoare de ${discountStr} Lei, adica 0,2% din dobanda standard.`;
          this.downPaymentInfoType = 'info';
        } else {
          this.downPaymentInfoNote = 'Imobilul adus in garantie iti aduce o reducere a ratei lunare de 0,2% din dobanda standard.';
          this.downPaymentInfoType = 'info';
        }
      }
    } else if (this.selectedProductType === 'achizitie-imobil' || this.selectedProductType === 'credit-venit') {
      // For purchase and income-based credit - check if down payment is at least 20%
      const propertyValue = this.propertyValue || 0;
      const downPayment = this.downPaymentAmount || 0;
      const twentyPercent = propertyValue * 0.20;
      
      if (downPayment >= twentyPercent) {
        // Success case - down payment is at least 20%
        // Calculate the discount amount from the response
        const discountAmount = response?.loanCosts?.discounts?.discountAmountDownPayment || 0;
        const discountStr = discountAmount > 0 ? discountAmount.toFixed(2) : '0.00';
        this.downPaymentInfoNote = `Deoarece avansul tău reprezintă cel puțin 20% din prețul locuinței, beneficiezi de o reducere a ratei lunare în valoare de ${discountStr} Lei adică 0,2% din dobânda standard.`;
        this.downPaymentInfoType = 'success';
      } else {
        // Info case - down payment is less than 20%
        this.downPaymentInfoNote = 'Dacă avansul tău reprezintă cel puțin 20% din prețul locuinței, beneficiezi de o reducere a ratei lunare de 0,2% din dobânda standard.';
        this.downPaymentInfoType = 'info';
      }
    } else {
      // For other product types (refinantare) - no note
      this.downPaymentInfoNote = undefined;
      this.downPaymentInfoType = undefined;
    }
  }

  // Build columns for desktop web summary card (three offers in one card)
  getWebSummaryColumns(): Array<{
    leftTop: any;
    rightTop: any;
    leftBottom?: any;
    rightBottom?: any;
    extraDetails?: Array<{ label: string; value: string }>;
    title?: string;
    interestType?: string;
  }> {
    const columns: Array<any> = [];

    const variants: Array<any | undefined> = [
      this.calculationResponse,
      this.calculationResponseAllDiscounts,
      this.calculationResponseNoDiscounts
    ];
    const titles = [
      'Oferta ta personalizata',
      'Cu toate reducerile',
      'Fara reduceri'
    ];

    variants.forEach((resp, idx) => {
      if (!resp) { return; }
      const variableRate = ((resp?.interestRateFormula?.bankMarginRate || 0) + (resp?.interestRateFormula?.irccRate || 0));
      let infoNote: string | undefined;
      const extraDetails: Array<{ label: string; value: string }> = [];
      
      // Pentru dobânda variabilă, inhibă câmpurile dobânzii fixe și ratei lunare după trecerea anilor
      if (this.interestType !== 'variabila') {
        extraDetails.push({ label: 'Dobândă fixă', value: (resp?.nominalInterestRate || 0).toFixed(2) + ' %' });
        extraDetails.push({ label: 'Rată lunară (după trecerea anilor cu dobândă fixă)', value: ((resp?.monthlyInstallment?.amountVariableInterest) || 0).toFixed(2) + ' Lei' });
      }
      
      // Dobânda variabilă se afișează întotdeauna
      extraDetails.push({ label: 'Dobândă variabilă', value: (variableRate || 0).toFixed(2) + ' %' });
      
      // Câmpurile comune
      extraDetails.push(
        { label: 'DAE', value: (resp?.annualPercentageRate || 0).toFixed(2) + ' %' },
        { label: 'Tip rate', value: ((this.rateType === 'egale') ? 'Rate egale' : 'Rate descrescătoare') }
      );
      
      // Avans - ascuns pentru refinanțare
      if (this.selectedProductType !== 'refinantare') {
        extraDetails.push({ label: 'Avans', value: ((resp?.downPayment?.amount) || 0).toFixed(2) + ' Lei' });
      }
      
      extraDetails.push(
        { label: 'Suma solicitată', value: ((resp?.loanAmount?.amount) || 0).toFixed(2) + ' Lei' },
        { label: 'Valoarea totală plătibilă', value: ((resp?.totalPaymentAmount?.amount) || 0).toFixed(2) + ' Lei' }
      );

      // Product-specific extra details
      if (this.selectedProductType === 'constructie-renovare') {
        const noDoc = (resp?.noDocAmount) as number | undefined;
        const minGuarantee = resp?.minGuaranteeAmount as number | undefined;
        if (typeof noDoc === 'number') {
          extraDetails.push({ label: 'Sume fără justificare', value: (noDoc || 0).toFixed(2) + ' Lei' });
        }
        if (typeof minGuarantee === 'number') {
          extraDetails.push({ label: 'Valoare minimă a garanției', value: (minGuarantee || 0).toFixed(2) + ' Lei' });
        }
      } else if (this.selectedProductType === 'refinantare') {
        const minGuarantee = resp?.minGuaranteeAmount as number | undefined;
        if (typeof minGuarantee === 'number') {
          extraDetails.push({ label: 'Valoare minimă a garanției', value: (minGuarantee || 0).toFixed(2) + ' Lei' });
        }
      }

      // Note: infoNote is now displayed in the down payment input component
      // No longer needed in summary cards

      columns.push({
        title: titles[idx] || '',
        leftTop: {
          label: 'Dobândă inițială',
          amount: (resp?.nominalInterestRate || 0).toFixed(2),
          currency: '%'
        },
        rightTop: {
          label: this.interestType === 'variabila' ? 'Rată lunară variabilă' : 'Rată lunară de plată',
          amount: this.interestType === 'variabila' 
            ? (resp?.monthlyInstallment?.amountVariableInterest || 0).toFixed(2)
            : (resp?.monthlyInstallment?.amountFixedInterest || 0).toFixed(2),
          currency: 'Lei/lună'
        },
        leftBottom: undefined,
        rightBottom: undefined,
        extraDetails,
        interestType: this.interestType
      });
    });

    return columns;
  }

  private markInteracted(): void {
    this.hasUserInteracted = true;
    // Do not persist product type on interaction
  }

  private saveFormState(): void {
    // Intentionally left as no-op: we do not persist form state
    return;
  }

  private coerceNumber(value: any, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  // Jentis tracking helper with duplicate prevention
  private lastTrackedEvent: string = '';
  private lastTrackedTime: number = 0;
  private readonly TRACK_DEBOUNCE_MS = 500; // Prevent duplicates within 500ms

  private trackEvent(action: string, label: string, value?: string | number): void {
    if (typeof window !== 'undefined' && (window as any)._jts) {
      try {
        // Create a unique key for this event
        const eventKey = `${action}:${label}:${value}`;
        const now = Date.now();
        
        // Skip if this is a duplicate event within the debounce window
        if (eventKey === this.lastTrackedEvent && (now - this.lastTrackedTime) < this.TRACK_DEBOUNCE_MS) {
          console.log('🚫 Duplicate event prevented:', { action, label, value });
          return;
        }
        
        // Update tracking state
        this.lastTrackedEvent = eventKey;
        this.lastTrackedTime = now;
        
        // Send event to Jentis
        (window as any)._jts.push({
          track: 'event',
          category: 'Calculator Ipotecar',
          action: action,
          label: label,
          value: value
        });
        console.log('📊 Jentis event tracked:', { action, label, value });
      } catch (error) {
        console.error('Jentis tracking error:', error);
      }
    }
  }
}
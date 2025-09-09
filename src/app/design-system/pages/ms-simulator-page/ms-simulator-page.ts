import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil, debounceTime } from 'rxjs';
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
import { MortgageCalculationService } from '../../../services/mortgage-calculation.service';
import { MortgageCalculationRequest } from '../../../../model/MortgageCalculationRequest';
import { MortgageCalculationResponse } from '../../../../model/MortgageCalculationResponse';
import { Amount } from '../../../../model/Amount';
import { Area } from '../../../../model/Area';
import { Income } from '../../../../model/Income';
import { SpecialOfferRequirements } from '../../../../model/SpecialOfferRequirements';
import { InstallmentType } from '../../../../model/InstallmentType';

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
    MsProgressSpinner
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
  @Input() heroChipLabel: string = 'Achizitie imobil';
  @Input() heroHasClose: boolean = false;
  @Input() heroDisabled: boolean = false;
  @Input() selectedProductType: string = 'achizitie-imobil'; // Default product type
  
  // Property value input configuration
  @Input() propertyLabel: string = 'Valoarea proprietății';
  @Input() propertyHelperText: string = 'Introduceți valoarea totală a proprietății pe care doriți să o achiziționați';
  @Input() propertyPlaceholder: string = '0';
  @Input() propertyCurrency: string = 'RON';
  @Input() propertyMin: number = 100000;
  @Input() propertyMax: number = 1000000;
  @Input() propertyStep: number = 5000;
  @Input() propertyEurConversionRate: number = 5.0;
  @Input() propertyDisabled: boolean = false;
  @Input() propertyValue: number = 500000; // Default property value
  
  // Loan duration input configuration
  @Input() loanDurationLabel: string = 'Perioada imprumutului';
  @Input() loanDurationPlaceholder: string = '360';
  @Input() loanDurationSuffix: string = 'luni';
  @Input() loanDurationMin: number = 12; // 1 year minimum
  @Input() loanDurationMax: number = 360; // 30 years maximum
  @Input() loanDurationStep: number = 6; // 6 month increments
  @Input() loanDurationDisabled: boolean = false;
  @Input() loanDurationValue: number = 360; // Default loan duration
  
  // Age input configuration
  @Input() ageValue: number = 30;
  
  // Income Section configuration
  @Input() monthlyIncome: number = 12000;
  @Input() monthlyInstallments: number = 2100;
  
  // Down Payment Section configuration
  @Input() hasGuaranteeProperty: boolean = true;
  @Input() selectedGuaranteeValue: string = '240567';
  @Input() downPaymentAmount: number = 0;
  @Input() downPaymentDisabled: boolean = true; // Disabled by default
  
  // Property Location Section configuration
  @Input() selectedCounty: string = 'Bucuresti';
  @Input() selectedCity: string = 'Bucuresti';
  
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
  @Input() summaryHelperText: string = 'ofertă orientativă, calculată în baza datelor introduse de tine.';
  
  // Sticky footer configuration (mobile/tablet only)
  @Input() footerLeftAmount?: AmountData;
  @Input() footerRightAmount?: AmountData;
  @Input() footerActions?: StickyFooterActions;
  
  // Simulator Option Modal state
  isSimulatorModalVisible: boolean = false;
  
  // Form data and calculation state
  private destroy$ = new Subject<void>();
  private formDataSubject = new Subject<void>();
  private activeCalculationSub?: Subscription;
  isLoading: boolean = false;
  calculationResponse?: MortgageCalculationResponse;
  calculationResponseAllDiscounts?: MortgageCalculationResponse;
  calculationResponseNoDiscounts?: MortgageCalculationResponse;
  errorMessage?: string;
  
  // Form validation state
  isFormValid: boolean = true;
  
  constructor(private mortgageService: MortgageCalculationService) {}
  
  ngOnInit(): void {
    // Set up form data change detection with debouncing
    this.formDataSubject
      .pipe(
        debounceTime(350),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('📝 Form data changed, validating...');
        this.validateForm();
        if (this.isFormValid) {
          console.log('✅ Form is valid, calculating mortgage...');
          this.calculateMortgage();
        } else {
          console.log('❌ Form is not valid, skipping calculation');
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
  private validateForm(): void {
    this.isFormValid = !!(
      this.propertyValue &&
      this.loanDurationValue &&
      this.ageValue &&
      this.monthlyIncome &&
      this.selectedCounty &&
      this.selectedCity &&
      this.rateType &&
      this.interestType
      // downPaymentAmount is not required for validation since it's disabled initially
    );
    
    console.log('🔍 Form validation:', {
      propertyValue: this.propertyValue,
      loanDurationValue: this.loanDurationValue,
      ageValue: this.ageValue,
      monthlyIncome: this.monthlyIncome,
      selectedCounty: this.selectedCounty,
      selectedCity: this.selectedCity,
      rateType: this.rateType,
      interestType: this.interestType,
      isFormValid: this.isFormValid
    });
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
    request.loanAmount.amount = this.calculateLoanAmount();
    
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
    request.specialOfferRequirements.casaVerde = this.greenCertificate;
    
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
        return 'casaTa';
      case 'refinantare':
        return 'refinantare';
      case 'constructie-renovare':
        return 'constructie';
      case 'credit-venit':
        return 'creditVenit';
      default:
        return 'casaTa'; // Default fallback
    }
  }
  
  private calculateMortgage(): void {
    // Cancel any in-flight request to return the latest result faster
    if (this.activeCalculationSub) {
      this.activeCalculationSub.unsubscribe();
    }

    this.isLoading = true;
    this.errorMessage = undefined;

    const request = this.createMortgageRequest();
    console.log("############ Mortgage Request:", request);

    this.activeCalculationSub = this.mortgageService.calculateMortgage(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.calculationResponse = response;
          
          // Update down payment amount from backend response
          if (response.downPayment && response.downPayment.amount) {
            this.downPaymentAmount = response.downPayment.amount;
            this.downPaymentDisabled = false; // Enable the input after first calculation
          }

          // Populate sticky footer (tablet) amounts and actions
          this.footerLeftAmount = {
            label: 'Prima rata fixa',
            amount: (response.monthlyInstallment?.amountFixedInterest || 0).toFixed(0),
            currency: 'Lei/luna'
          };
          this.footerRightAmount = {
            label: 'Suma totala',
            amount: (response.totalPaymentAmount?.amount || 0).toFixed(0),
            currency: 'Lei'
          };
          this.footerActions = {
            primary: { label: 'Aplica' },
            details: { label: 'Detalii' },
            share: { ariaLabel: 'Distribuie oferta' }
          };
          
          this.isLoading = false;

          // Trigger variant calculations in background
          try {
            const baseRequest = this.createMortgageRequest();
            this.calculateVariants(baseRequest);
          } catch {}
        },
        error: (error) => {
          this.errorMessage = error.message || 'A apărut o eroare la calcularea creditului. Vă rugăm să încercați din nou.';
          this.isLoading = false;
          console.error('Mortgage calculation error:', error);
        }
      });
  }

  private calculateVariants(baseRequest: MortgageCalculationRequest): void {
    // All discounts true
    const reqAll: MortgageCalculationRequest = JSON.parse(JSON.stringify(baseRequest));
    reqAll.hasInsurance = true;
    reqAll.specialOfferRequirements = reqAll.specialOfferRequirements || new SpecialOfferRequirements();
    reqAll.specialOfferRequirements.hasSalaryInTheBank = true;
    reqAll.specialOfferRequirements.casaVerde = true;
    this.mortgageService.calculateMortgage(reqAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: r => this.calculationResponseAllDiscounts = r, error: () => {} });

    // All discounts false
    const reqNone: MortgageCalculationRequest = JSON.parse(JSON.stringify(baseRequest));
    reqNone.hasInsurance = false;
    reqNone.specialOfferRequirements = reqNone.specialOfferRequirements || new SpecialOfferRequirements();
    reqNone.specialOfferRequirements.hasSalaryInTheBank = false;
    reqNone.specialOfferRequirements.casaVerde = false;
    this.mortgageService.calculateMortgage(reqNone)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: r => this.calculationResponseNoDiscounts = r, error: () => {} });
  }
  
  private triggerFormValidation(): void {
    console.log('🚀 Triggering form validation...');
    this.formDataSubject.next();
  }

  // Event handlers
  onHeaderBackClick(event: MouseEvent): void { this.headerBackClicked.emit(event); }
  onHeaderPrimaryActionClick(event: MouseEvent): void { this.headerPrimaryActionClicked.emit(event); }
  onHeaderSecondaryActionClick(event: MouseEvent): void { this.headerSecondaryActionClicked.emit(event); }
  onHeroChipClick(): void { 
    this.isSimulatorModalVisible = true;
    this.heroChipClicked.emit(); 
  }
  onHeroCloseClick(): void { this.heroCloseClicked.emit(); }
  onPropertyValueChange(value: number): void { 
    this.propertyValue = value;
    this.propertyValueChange.emit(value);
    this.triggerFormValidation();
  }
  onPropertyFocused(event: FocusEvent): void { this.propertyFocused.emit(event); }
  onPropertyBlurred(event: FocusEvent): void { this.propertyBlurred.emit(event); }
  onLoanDurationValueChange(value: number): void { 
    this.loanDurationValue = value;
    this.loanDurationValueChange.emit(value);
    this.triggerFormValidation();
  }
  onLoanDurationFocused(event: FocusEvent): void { this.loanDurationFocused.emit(event); }
  onLoanDurationBlurred(event: FocusEvent): void { this.loanDurationBlurred.emit(event); }
  onAgeValueChange(value: number): void {
    this.ageValue = value;
    this.ageValueChange.emit(value);
    this.triggerFormValidation();
  }
  onFooterDetailsClick(event: MouseEvent): void { this.footerDetailsClicked.emit(event); }
  onFooterPrimaryClick(event: MouseEvent): void { this.footerPrimaryClicked.emit(event); }
  onFooterShareClick(event: MouseEvent): void { this.footerShareClicked.emit(event); }
  // Income Section event handlers
  onMonthlyIncomeChange(value: number): void { 
    this.monthlyIncome = value;
    this.monthlyIncomeChange.emit(value);
    this.triggerFormValidation();
  }
  onMonthlyInstallmentsChange(value: number): void { 
    this.monthlyInstallments = value;
    this.monthlyInstallmentsChange.emit(value);
    this.triggerFormValidation();
  }
  // Down Payment Section event handlers
  onGuaranteePropertyChange(value: boolean): void { 
    this.hasGuaranteeProperty = value;
    this.guaranteePropertyChange.emit(value);
    this.triggerFormValidation();
  }
  onGuaranteeValueChange(value: string): void { 
    this.selectedGuaranteeValue = value;
    this.guaranteeValueChange.emit(value);
    this.triggerFormValidation();
  }
  onDownPaymentAmountChange(value: number): void { 
    this.downPaymentAmount = value;
    this.downPaymentAmountChange.emit(value);
    this.triggerFormValidation();
  }
  // Property Location Section event handlers
  onCountyChange(value: string): void { 
    this.selectedCounty = value;
    this.countyChange.emit(value);
    this.triggerFormValidation();
  }
  onCityChange(value: string): void { 
    this.selectedCity = value;
    this.cityChange.emit(value);
    this.triggerFormValidation();
  }
  // Interest Preferences Section event handlers
  onRateTypeChange(value: string): void { 
    this.rateType = value;
    this.rateTypeChange.emit(value);
    this.triggerFormValidation();
  }
  onInterestTypeChange(value: string): void { 
    this.interestType = value;
    this.interestTypeChange.emit(value);
    this.triggerFormValidation();
  }
  // Interest Reduction Section event handlers
  onLifeInsuranceChange(value: boolean): void { 
    this.lifeInsurance = value;
    this.lifeInsuranceChange.emit(value);
    this.triggerFormValidation();
  }
  onSalaryTransferChange(value: boolean): void { 
    this.salaryTransfer = value;
    this.salaryTransferChange.emit(value);
    this.triggerFormValidation();
  }
  onGreenCertificateChange(value: boolean): void { 
    this.greenCertificate = value;
    this.greenCertificateChange.emit(value);
    this.triggerFormValidation();
  }
  
  // Simulator Option Modal event handlers
  onSimulatorModalClose(): void {
    this.isSimulatorModalVisible = false;
  }
  
  onSimulatorOptionSelected(optionId: string): void {
    // Update the selected product type
    this.selectedProductType = optionId;
    
    // Update the chip label based on selected option
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
    
    // Close the modal
    this.isSimulatorModalVisible = false;
    
    // Trigger form validation to recalculate with new product type
    this.triggerFormValidation();
    
    // Emit the selection event for parent components
    this.simulatorOptionSelected.emit(optionId);
  }
} 
import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsSwitchForm } from '../../molecules/ms-switch-form/ms-switch-form';
import { MsSavingsChip } from '../../organisms/ms-savings-chip/ms-savings-chip';

@Component({
  selector: 'ms-interest-reduction-section',
  standalone: true,
  imports: [
    CommonModule,
    MsCardOutsideTitleComponent,
    MsCard,
    MsSwitchForm,
    MsSavingsChip
  ],
  template: `
    <div [class]="getInterestReductionSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Opțiuni de reduceri de dobândă"
        helperText="Scad rata lunară și gradul de îndatorare"
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card>
        <div class="ms-interest-reduction-section__content">
          <!-- Life Insurance Switch -->
            <ms-switch-form 
            [surface]="effectiveSurface"
            [labelText]="insuranceLabel"
              [rightText]="savingsInsurance > 0 ? formatSavings(savingsInsurance) : ''"
            [rightTextDisabled]="!lifeInsurance"
            switchLabel="Asigurare de viață"
            [checked]="lifeInsurance"
            [showInfoIcon]="true"
            infoTooltip="Asigurarea de viață va proteja familia în cazul unor evenimente neașteptate și va reduce dobânda cu 0.2%"
            [disabled]="disabled"
            (change)="onLifeInsuranceChange($event)">
          </ms-switch-form>
          
          <!-- Salary Transfer Switch -->
            <ms-switch-form 
            [surface]="effectiveSurface"
            [labelText]="salaryLabel"
              [rightText]="savingsSalary > 0 ? formatSavings(savingsSalary) : ''"
            [rightTextDisabled]="!salaryTransfer"
            switchLabel="Încasare salariu la Raiffeisen"
            [checked]="salaryTransfer"
            [showInfoIcon]="true"
            infoTooltip="Prin transferul salariului la Raiffeisen beneficiezi de o reducere de 1% la dobândă"
            [disabled]="disabled"
            (change)="onSalaryTransferChange($event)">
          </ms-switch-form>
          
          <!-- Green Certificate Switch - Hidden for construction -->
            <ms-switch-form 
            *ngIf="!hideGreenCertificate"
            [surface]="effectiveSurface"
            [labelText]="greenLabel"
              [rightText]="savingsGreen > 0 ? formatSavings(savingsGreen) : ''"
            [rightTextDisabled]="!greenCertificate"
            switchLabel="Certificat de locuință verde"
            [checked]="greenCertificate"
            [showInfoIcon]="true"
            infoTooltip="Locuințele cu certificat verde beneficiază de o reducere de 0.4% la dobândă"
            [disabled]="disabled"
            (change)="onGreenCertificateChange($event)">
          </ms-switch-form>

          
          
          <!-- Savings Chip -->
          <div class="ms-interest-reduction-section__savings">
            <ms-savings-chip 
              [text]="totalSavings + ' Lei economisiți'"
              size="m"
              [infoOnly]="true"
              iconLeft="checkmark-ring"
              [fullWidth]="true">
            </ms-savings-chip>
          </div>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-interest-reduction-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsInterestReductionSection {
  @Input() lifeInsurance: boolean = true;
  @Input() salaryTransfer: boolean = true;
  @Input() greenCertificate: boolean = true;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() hideGreenCertificate: boolean = false; // Hide green certificate option for construction

  // Savings amounts fed from backend response (loanCosts.discounts)
  @Input() savingsInsurance: number = 0;
  @Input() savingsSalary: number = 0;
  @Input() savingsGreen: number = 0;
  @Input() totalSavingsAmount: number = 0;

  @Output() lifeInsuranceChange = new EventEmitter<boolean>();
  @Output() salaryTransferChange = new EventEmitter<boolean>();
  @Output() greenCertificateChange = new EventEmitter<boolean>();

  get insuranceLabel(): string { return 'Pentru 0.2% reducere la dobândă'; }

  get salaryLabel(): string { return 'Pentru 1% reducere la dobândă'; }

  get greenLabel(): string { return 'Pentru 0.4% reducere la dobândă'; }

  formatSavings(value: number): string {
    const v = Math.abs(value || 0);
    return `${v.toFixed(2)} Lei economisiți`;
  }

  get totalSavings(): string {
    return (this.totalSavingsAmount || 0).toFixed(2);
  }

  get effectiveSurface(): 'light' | 'dark' {
    if (this.surface === 'dark' || this.surface === 'light') return this.surface;
    const theme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
    return theme === 'dark' ? 'dark' : 'light';
  }

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  onLifeInsuranceChange(event: { checked: boolean }): void {
    this.lifeInsuranceChange.emit(event.checked);
  }

  onSalaryTransferChange(event: { checked: boolean }): void {
    this.salaryTransferChange.emit(event.checked);
  }

  onGreenCertificateChange(event: { checked: boolean }): void {
    this.greenCertificateChange.emit(event.checked);
  }


  getInterestReductionSectionClasses(): string[] {
    const classes = [
      'ms-interest-reduction-section',
      `ms-interest-reduction-section--surface-${this.effectiveSurface}`
    ];

    if (this.disabled) {
      classes.push('ms-interest-reduction-section--disabled');
    }

    return classes;
  }
} 
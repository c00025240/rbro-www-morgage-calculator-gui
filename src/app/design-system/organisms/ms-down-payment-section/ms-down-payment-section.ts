import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsSwitchForm } from '../../molecules/ms-switch-form/ms-switch-form';
import { MsRadioForm } from '../../molecules/ms-radio-form/ms-radio-form';
import { RadioOption } from '../../atoms/ms-radio-custom/ms-radio-custom';

@Component({
  selector: 'ms-down-payment-section',
  standalone: true,
  imports: [
    CommonModule,
    MsCardOutsideTitleComponent,
    MsCard,
    MsSwitchForm,
    MsRadioForm
  ],
  template: `
    <div [class]="getDownPaymentSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Avansul pentru imobil"
        helperText="Raiffeisen acceptă Avans 0, dacă aduci un alt imobil în garanție"
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card>
        <div class="ms-down-payment-section__content">
          <!-- Switch form for guarantee property -->
          <ms-switch-form 
            switchLabel="Aduc in garantie alt imobil"
            [checked]="hasGuaranteeProperty"
            [disabled]="disabled"
            (change)="onGuaranteePropertyChange($event)">
          </ms-switch-form>
          
          <!-- Radio forms for guarantee values -->
          <ms-radio-form 
            labelText="Valoare minimă a garanției"
            [radioOption]="guaranteeOption1"
            [radioValue]="selectedGuaranteeValue"
            radioName="garantie"
            [disabled]="disabled"
            (radioChange)="onGuaranteeValueChange($event)">
          </ms-radio-form>
          
          <ms-radio-form 
            labelText="Valoare minimă pentru 0.2% reducere la dobândă"
            [radioOption]="guaranteeOption2"
            [radioValue]="selectedGuaranteeValue"
            radioName="garantie"
            chipType="savings"
            chipData="45,81 Lei economisiți"
            [disabled]="disabled"
            (radioChange)="onGuaranteeValueChange($event)">
          </ms-radio-form>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-down-payment-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsDownPaymentSection {
  @Input() hasGuaranteeProperty: boolean = true;
  @Input() selectedGuaranteeValue: string = '240567';
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() guaranteePropertyChange = new EventEmitter<boolean>();
  @Output() guaranteeValueChange = new EventEmitter<string>();

  // Radio button options
  guaranteeOption1: RadioOption = {
    label: '200.456 Lei',
    value: '200456'
  };

  guaranteeOption2: RadioOption = {
    label: '240.567 Lei', 
    value: '240567'
  };

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  onGuaranteePropertyChange(event: { checked: boolean }): void {
    this.guaranteePropertyChange.emit(event.checked);
  }

  onGuaranteeValueChange(value: string): void {
    this.guaranteeValueChange.emit(value);
  }

  getDownPaymentSectionClasses(): string[] {
    const classes = [
      'ms-down-payment-section',
      `ms-down-payment-section--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-down-payment-section--disabled');
    }

    return classes;
  }
}

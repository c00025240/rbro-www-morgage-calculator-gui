import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsTextFieldCustomComponent } from '../../atoms/ms-text-field-custom/ms-text-field-custom';

@Component({
  selector: 'ms-income-section',
  standalone: true,
  imports: [
    CommonModule,
    MsCardOutsideTitleComponent,
    MsCard,
    MsTextFieldCustomComponent
  ],
  template: `
    <div [class]="getIncomeSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Venitul tău"
        helperText="Influențează suma maximă pe care o poți împrumuta"
        [hasHelper]="true"
        [surface]="cardSurface">
      </ms-card-outside-title>

      <ms-card [surface]="cardSurface">
        <div class="ms-income-section__content">
          <ms-text-field-custom
            label="Venitul tău lunar"
            [value]="monthlyIncome.toString()"
            placeholder="0"
            suffixText="Lei"
            type="number"
            [error]="incomeTooLow"
            [helperText]="incomeTooLow ? 'Venitul tău este mai mic decât suma minimă eligibilă' : undefined"
            [disabled]="disabled"
            [surface]="cardSurface"
            (valueChange)="onMonthlyIncomeChange($event)">
          </ms-text-field-custom>

          <ms-text-field-custom
            label="Suma totală a ratelor bancare, pe lună"
            [value]="monthlyInstallments.toString()"
            placeholder="0"
            suffixText="Lei"
            type="number"
            [disabled]="disabled"
            [surface]="cardSurface"
            (valueChange)="onMonthlyInstallmentsChange($event)">
          </ms-text-field-custom>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-income-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsIncomeSection {
  @Input() monthlyIncome: number = 12000;
  @Input() monthlyInstallments: number = 2100;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() monthlyIncomeChange = new EventEmitter<number>();
  @Output() monthlyInstallmentsChange = new EventEmitter<number>();

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  private readonly MIN_INCOME = 2600;
  get incomeTooLow(): boolean {
    return (Number(this.monthlyIncome) || 0) < this.MIN_INCOME;
  }

  onMonthlyIncomeChange(value: string): void {
    const numericValue = parseFloat(value) || 0;
    this.monthlyIncomeChange.emit(numericValue);
  }

  onMonthlyInstallmentsChange(value: string): void {
    const numericValue = parseFloat(value) || 0;
    this.monthlyInstallmentsChange.emit(numericValue);
  }

  getIncomeSectionClasses(): string[] {
    const classes = [
      'ms-income-section',
      `ms-income-section--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-income-section--disabled');
    }

    return classes;
  }
}

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
        title="Venitul tau"
        helperText="Influenteaza suma maxima pe care o poti imprumuta"
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card>
        <div class="ms-income-section__content">
          <ms-text-field-custom
            label="Venitul tau lunar"
            [value]="monthlyIncome.toString()"
            suffixText="RON"
            type="number"
            [disabled]="disabled"
            (valueChange)="onMonthlyIncomeChange($event)">
          </ms-text-field-custom>

          <ms-text-field-custom
            label="Suma totala a ratelor bancare, pe luna"
            [value]="monthlyInstallments.toString()"
            suffixText="RON"
            type="number"
            [disabled]="disabled"
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

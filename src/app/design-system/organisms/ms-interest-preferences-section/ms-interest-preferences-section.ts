import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsSelect } from '../../atoms/ms-select/ms-select';

export interface PreferenceOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ms-interest-preferences-section',
  standalone: true,
  imports: [
    CommonModule,
    MsCardOutsideTitleComponent,
    MsCard,
    MsSelect
  ],
  template: `
    <div [class]="getInterestPreferencesSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Preferințe legate de dobândă"
        helperText="Influențează suma pe care o vei achita lunar"
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card [allowOverflow]="true">
        <div class="ms-interest-preferences-section__content">
			<ms-select
				*ngIf="false"
				label="Tip calcul rate"
				[value]="rateType"
				[options]="rateTypeOptions"
				helperText="Aceasta rata lunara pe toata durata creditului, cu un efort financiar constant."
				[disabled]="true"
				(valueChange)="onRateTypeChange($event)">
			</ms-select>

          <ms-select
            label="Tip dobândă"
            [value]="interestType"
            [options]="interestTypeOptions"
            helperText="Rate stabile în perioada fixă, apoi variabile."
            [disabled]="disabled"
            (valueChange)="onInterestTypeChange($event)">
          </ms-select>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-interest-preferences-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsInterestPreferencesSection {
  @Input() rateType: string = 'egale';
  @Input() interestType: string = 'fixa_3';
  @Input() rateTypeOptions: PreferenceOption[] = [
    { value: 'egale', label: 'Rate egale' },
    { value: 'descrescatoare', label: 'Rate descrescătoare' }
  ];
  @Input() interestTypeOptions: PreferenceOption[] = [
    { value: 'fixa_3', label: 'Dobândă fixă primii 3 ani' },
    { value: 'fixa_5', label: 'Dobândă fixă primii 5 ani' },
    { value: 'variabila', label: 'Dobândă variabilă' }
  ];
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() rateTypeChange = new EventEmitter<string>();
  @Output() interestTypeChange = new EventEmitter<string>();

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  onRateTypeChange(value: string): void {
    this.rateTypeChange.emit(value);
  }

  onInterestTypeChange(value: string): void {
    this.interestTypeChange.emit(value);
  }

  getInterestPreferencesSectionClasses(): string[] {
    const classes = [
      'ms-interest-preferences-section',
      `ms-interest-preferences-section--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-interest-preferences-section--disabled');
    }

    return classes;
  }
} 
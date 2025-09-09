import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsSelect } from '../../atoms/ms-select/ms-select';

export interface LocationOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ms-property-location-section',
  standalone: true,
  imports: [
    CommonModule,
    MsCardOutsideTitleComponent,
    MsCard,
    MsSelect
  ],
  template: `
    <div [class]="getPropertyLocationSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Zona imobilului adus in garantie"
        helperText="Poate fi un imobil aflat în proprietatea ta sau a altcuiva."
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card [allowOverflow]="true">
        <div class="ms-property-location-section__content">
          <ms-select
            label="Judet"
            [value]="selectedCounty"
            [options]="countyOptions"
            [disabled]="disabled"
            (valueChange)="onCountyChange($event)">
          </ms-select>

          <ms-select
            label="Localitate"
            [value]="selectedCity"
            [options]="cityOptions"
            helperText="Pentru locuințe din sate, alege județul și apoi comuna de care aparține satul."
            [disabled]="disabled"
            (valueChange)="onCityChange($event)">
          </ms-select>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-property-location-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsPropertyLocationSection {
  @Input() selectedCounty: string = 'Bucuresti';
  @Input() selectedCity: string = 'Bucuresti';
  @Input() countyOptions: LocationOption[] = [
    { value: 'Bucuresti', label: 'Bucuresti' },
    { value: 'Cluj', label: 'Cluj' },
    { value: 'Timis', label: 'Timis' },
    { value: 'Constanta', label: 'Constanta' },
    { value: 'Iasi', label: 'Iasi' }
  ];
  @Input() cityOptions: LocationOption[] = [
    { value: 'Bucuresti', label: 'Bucuresti' },
    { value: 'Sector1', label: 'Sector 1' },
    { value: 'Sector2', label: 'Sector 2' },
    { value: 'Sector3', label: 'Sector 3' },
    { value: 'Sector4', label: 'Sector 4' }
  ];
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() countyChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  onCountyChange(value: string): void {
    this.countyChange.emit(value);
  }

  onCityChange(value: string): void {
    this.cityChange.emit(value);
  }

  getPropertyLocationSectionClasses(): string[] {
    const classes = [
      'ms-property-location-section',
      `ms-property-location-section--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-property-location-section--disabled');
    }

    return classes;
  }
} 
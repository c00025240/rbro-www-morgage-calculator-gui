import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsSelect } from '../../atoms/ms-select/ms-select';
import { MortgageCalculationService } from '../../../services/mortgage-calculation.service';
import { District } from '../../../../model/District';

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
export class MsPropertyLocationSection implements OnChanges, OnInit {
  @Input() selectedCounty: string = 'BUCURESTI';
  @Input() selectedCity: string = 'BUCURESTI';
  @Input() countyOptions: LocationOption[] = []; // Will be populated from districts API
  @Input() cityOptions: LocationOption[] = []; // Will be populated from districts API
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  // reset removed

  @Output() countyChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();

  private districts: District[] = [];
  // remount toggle removed

  constructor(private cdr: ChangeDetectorRef, private mortgageService: MortgageCalculationService) {}

  ngOnInit(): void {
    // If parent did not provide options, populate from service
    const needsPopulate = (!this.countyOptions || this.countyOptions.length === 0) || (!this.cityOptions || this.cityOptions.length === 0);
    if (needsPopulate) {
      this.mortgageService.getDistricts().subscribe({
        next: (list) => {
          this.districts = list || [];
          // Build unique counties
          const uniqueCounties = Array.from(new Set(this.districts.map(d => d.county))).sort();
          this.countyOptions = uniqueCounties.map(c => ({ value: c, label: c }));
          // Ensure selected county exists
          if (!this.selectedCounty || !uniqueCounties.includes(this.selectedCounty)) {
            this.selectedCounty = this.countyOptions[0]?.value || '';
          }
          // Build cities for selected county
          this.cityOptions = this.buildCityOptions(this.selectedCounty);
          // Ensure selected city exists
          const cityValues = this.cityOptions.map(o => o.value);
          if (!this.selectedCity || !cityValues.includes(this.selectedCity)) {
            this.selectedCity = this.cityOptions[0]?.value || '';
          }
          this.cdr.markForCheck();
        },
        error: () => {
          // Leave options as-is on error
          this.cdr.markForCheck();
        }
      });
    }
  }

  ngOnChanges(): void {
    // explicit reset removed; rely on normalization below
    // Normalize county selection against provided options (fallback safety)
    const countyValues = (this.countyOptions || []).map(o => o.value);
    if (countyValues.length > 0 && !countyValues.includes(this.selectedCounty)) {
      this.selectedCounty = countyValues.includes('BUCURESTI') ? 'BUCURESTI' : countyValues[0];
    }

    // Normalize city selection against provided options (fallback safety)
    const cityValues = (this.cityOptions || []).map(o => o.value);
    if (cityValues.length > 0 && !cityValues.includes(this.selectedCity)) {
      this.selectedCity = cityValues.includes('BUCURESTI') ? 'BUCURESTI' : cityValues[0];
    }

    // Force change detection when input properties change
    console.log('🔄 MsPropertyLocationSection - Changes detected:', {
      countyOptions: this.countyOptions,
      cityOptions: this.cityOptions,
      selectedCounty: this.selectedCounty,
      selectedCity: this.selectedCity
    });
    this.cdr.markForCheck();
  }

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  onCountyChange(value: string): void {
    this.countyChange.emit(value);
    // Update cities when county changes if we have local districts
    if (this.districts && this.districts.length > 0) {
      this.cityOptions = this.buildCityOptions(value);
      // Reset selected city to first available
      this.selectedCity = this.cityOptions[0]?.value || '';
      this.cdr.markForCheck();
    }
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

  private buildCityOptions(county: string): LocationOption[] {
    const cities = this.districts
      .filter(d => d.county === county)
      .map(d => d.city);
    const uniqueCities = Array.from(new Set(cities)).sort();
    return uniqueCities.map(c => ({ value: c, label: c }));
  }
} 
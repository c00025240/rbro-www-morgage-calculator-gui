import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsCombobox, ComboboxOption } from '../../atoms/ms-combobox/ms-combobox';
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
    MsCombobox
  ],
  template: `
    <div [class]="getPropertyLocationSectionClasses().join(' ')">
      <ms-card-outside-title
        title="Zona imobilului adus în garanție"
        helperText="Imobil aflat în proprietatea ta sau a altcuiva"
        [hasHelper]="true">
      </ms-card-outside-title>

      <ms-card [allowOverflow]="true">
        <div class="ms-property-location-section__content">
          <ms-combobox
            label="Județ"
            [value]="selectedCounty"
            [options]="countySearchOptions"
            [loading]="countyLoading"
            [disabled]="disabled"
            [surface]="surface"
            [minSearchLength]="2"
            placeholder="Caută județ..."
            noResultsText="Niciun județ găsit"
            (searchChange)="onCountySearch($event)"
            (valueChange)="onCountyChange($event)">
          </ms-combobox>

          <ms-combobox
            label="Localitate"
            [value]="selectedCity"
            [options]="citySearchOptions"
            [loading]="cityLoading"
            [disabled]="disabled"
            [surface]="surface"
            [minSearchLength]="2"
            placeholder="Caută localitate..."
            noResultsText="Nicio localitate găsită"
            helperText="Pentru sate, selectează județul, apoi caută comuna aferentă."
            (searchChange)="onCitySearch($event)"
            (valueChange)="onCityChange($event)">
          </ms-combobox>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-property-location-section.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsPropertyLocationSection implements OnChanges, OnInit, OnDestroy {
  @Input() selectedCounty: string = 'Bucuresti';
  @Input() selectedCity: string = 'Bucuresti';
  @Input() countyOptions: LocationOption[] = []; // Legacy input - kept for backward compat
  @Input() cityOptions: LocationOption[] = []; // Legacy input - kept for backward compat
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() countyChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();

  // Internal state for combobox search
  countySearchOptions: ComboboxOption[] = [];
  citySearchOptions: ComboboxOption[] = [];
  countyLoading = false;
  cityLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, private mortgageService: MortgageCalculationService) {}

  ngOnInit(): void {
    // Load initial options for the default selected values
    this.loadInitialCountyOptions();
    this.loadCitiesForCounty(this.selectedCounty);
  }

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  /**
   * Load initial county options (call API without filter to get all counties)
   */
  private loadInitialCountyOptions(): void {
    this.countyLoading = true;
    this.cdr.markForCheck();

    this.mortgageService.searchDistricts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          const uniqueCounties = Array.from(new Set(districts.map(d => d.county))).sort();
          this.countySearchOptions = uniqueCounties.map(c => ({ value: c, label: c }));
          this.countyLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.countyLoading = false;
          this.countySearchOptions = [];
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Load cities for a given county
   */
  private loadCitiesForCounty(county: string): void {
    if (!county) return;

    this.cityLoading = true;
    this.cdr.markForCheck();

    this.mortgageService.searchDistricts(county)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          const uniqueCities = Array.from(new Set(districts.map(d => d.city))).sort();
          this.citySearchOptions = uniqueCities.map(c => ({ value: c, label: c }));
          this.cityLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cityLoading = false;
          this.citySearchOptions = [];
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Handle county search text changes (from combobox debounce)
   */
  onCountySearch(searchText: string): void {
    this.countyLoading = true;
    this.cdr.markForCheck();

    // Call API with county search filter
    const countyParam = searchText || undefined;
    this.mortgageService.searchDistricts(countyParam)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          const uniqueCounties = Array.from(new Set(districts.map(d => d.county))).sort();
          this.countySearchOptions = uniqueCounties.map(c => ({ value: c, label: c }));
          this.countyLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.countyLoading = false;
          this.countySearchOptions = [];
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Handle county selection
   */
  onCountyChange(value: string): void {
    this.selectedCounty = value;
    this.countyChange.emit(value);

    // Reset city and load cities for the new county
    this.selectedCity = '';
    this.citySearchOptions = [];
    this.loadCitiesForCounty(value);
  }

  /**
   * Handle city search text changes (from combobox debounce)
   */
  onCitySearch(searchText: string): void {
    this.cityLoading = true;
    this.cdr.markForCheck();

    // Call API with county + city search filter
    const countyParam = this.selectedCounty || undefined;
    const cityParam = searchText || undefined;
    this.mortgageService.searchDistricts(countyParam, cityParam)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          const uniqueCities = Array.from(new Set(districts.map(d => d.city))).sort();
          this.citySearchOptions = uniqueCities.map(c => ({ value: c, label: c }));
          this.cityLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cityLoading = false;
          this.citySearchOptions = [];
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Handle city selection
   */
  onCityChange(value: string): void {
    this.selectedCity = value;
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

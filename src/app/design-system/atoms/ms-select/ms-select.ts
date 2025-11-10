import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  HostBinding,
  OnInit,
  OnDestroy,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  HostListener,
  SecurityContext,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { MsHelperComponent } from '../ms-helper/ms-helper';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Value accessor provider
const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsSelect),
  multi: true,
};

@Component({
  selector: 'ms-select',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-select">
      <!-- Label -->
      <label 
        *ngIf="label"
        class="ms-select__label"
        [class.ms-select__label--required]="required"
        [for]="selectId">
        {{ label }}
      </label>

      <!-- Select Container -->
      <div 
        class="ms-select__container"
        [class.ms-select__container--focused]="isOpen"
        [class.ms-select__container--error]="error"
        [class.ms-select__container--disabled]="disabled">
        
        <!-- Select Trigger -->
        <div
          #selectTrigger
          class="ms-select__trigger"
          [id]="selectId"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="ariaDescribedby"
          [attr.aria-expanded]="isOpen"
          [attr.aria-haspopup]="'listbox'"
          [attr.tabindex]="disabled ? -1 : 0"
          (click)="toggleDropdown()"
          (keydown)="onKeydown($event)">
          
          <!-- Selected Value or Placeholder -->
          <span 
            class="ms-select__value"
            [class.ms-select__value--placeholder]="!selectedOption">
            {{ selectedOption?.label || placeholder || 'Selecteaza o optiune' }}
          </span>
          
          <!-- Dropdown Icon -->
          <div 
            class="ms-select__icon"
            [class.ms-select__icon--open]="isOpen"
            [innerHTML]="getIconHtml()">
          </div>
        </div>

        <!-- Dropdown Panel -->
        <div 
          *ngIf="isOpen"
          class="ms-select__dropdown"
          [attr.aria-labelledby]="selectId"
          role="listbox">
          
          <!-- Options List -->
          <div class="ms-select__options">
            <ng-container *ngIf="!hasGroups">
              <!-- Simple Options -->
              <div
                *ngFor="let option of options; trackBy: trackByOption"
                class="ms-select__option"
                [class.ms-select__option--selected]="option.value === value"
                [class.ms-select__option--disabled]="option.disabled"
                [attr.aria-selected]="option.value === value"
                [attr.tabindex]="option.disabled ? -1 : 0"
                role="option"
                (click)="selectOption(option)"
                (keydown)="onOptionKeydown($event, option)">
                {{ option.label }}
              </div>
            </ng-container>

            <ng-container *ngIf="hasGroups">
              <!-- Grouped Options -->
              <ng-container *ngFor="let group of groupedOptions | keyvalue">
                <div 
                  *ngIf="group.key !== 'default'"
                  class="ms-select__group-label">
                  {{ group.key }}
                </div>
                <div
                  *ngFor="let option of group.value; trackBy: trackByOption"
                  class="ms-select__option"
                  [class.ms-select__option--selected]="option.value === value"
                  [class.ms-select__option--disabled]="option.disabled"
                  [class.ms-select__option--grouped]="group.key !== 'default'"
                  [attr.aria-selected]="option.value === value"
                  [attr.tabindex]="option.disabled ? -1 : 0"
                  role="option"
                  (click)="selectOption(option)"
                  (keydown)="onOptionKeydown($event, option)">
                  {{ option.label }}
                </div>
              </ng-container>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Helper Text -->
      <ms-helper 
        *ngIf="helperText"
        [surface]="surface"
        [state]="error ? 'error' : 'regular'"
        class="ms-select__helper">
        {{ helperText }}
      </ms-helper>
    </div>
  `,
  styleUrls: ['./ms-select.scss'],
})
export class MsSelect implements ControlValueAccessor, OnInit, OnChanges, OnDestroy, AfterViewInit {
  
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() value: any = '';
  @Input() options: SelectOption[] = [];
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = false;
  @Input() helperText?: string;
  @Input() multiple = false; // For future implementation
  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;

  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<SelectOption | null>();

  @ViewChild('selectTrigger') selectTrigger?: ElementRef<HTMLDivElement>;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-select-component',
      `ms-select-component--surface-${this.surface}`,
      this.disabled ? 'ms-select-component--disabled' : '',
      this.error ? 'ms-select-component--error' : '',
      this.helperText ? 'ms-select-component--has-helper' : '',
      this.isOpen ? 'ms-select-component--open' : '',
    ].filter(Boolean).join(' ');
  }

  // Internal state
  public isOpen = false;
  private _iconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();

  // Internal computed properties
  public get selectedOption(): SelectOption | null {
    return this.options.find(option => option.value === this.value) || null;
  }

  public get selectId(): string {
    return this._selectId;
  }

  public get hasGroups(): boolean {
    return this.options.some(option => option.group);
  }

  public get groupedOptions(): { [key: string]: SelectOption[] } {
    if (!this.options.length) return {};
    
    const grouped: { [key: string]: SelectOption[] } = {};
    
    this.options.forEach(option => {
      const group = option.group || 'default';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(option);
    });
    
    return grouped;
  }

  private _selectId = `ms-select-${nextUniqueId++}`;

  // Form control methods
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Listen for clicks outside to close dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  // Icon loading methods (adapted from ms-text-field-custom)
  private loadIcon(): void {
    const iconName = 'select-open-down';
    console.log(`📁 Loading select icon: ${iconName}`);
    
    const possibleFilenames = [
      `${iconName}.svg`,
      `${iconName}-outlined.svg`,
      `${iconName} Style=outlined.svg`,
      `${iconName} Style=Outlined.svg`,
      `${iconName} Style=outline.svg`
    ];

    console.log(`🔍 Will try these filenames:`, possibleFilenames);
    this.tryLoadIconFiles(possibleFilenames, 0);
  }

  private tryLoadIconFiles(filenames: string[], index: number): void {
    if (index >= filenames.length) {
      console.warn(`❌ Could not load select icon. Tried all patterns.`);
      const fallbackSvg = this.getFallbackIconSvg();
      const processedFallback = this.processSvgContent(fallbackSvg);
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedFallback);
      this._iconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
      return;
    }

    const filename = filenames[index];
    const url = `/assets/icons/${encodeURIComponent(filename)}`;
    
    console.log(`🌐 Trying to load: ${url}`);

    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.log(`⚠️ Failed to load ${url}, trying next...`, error);
          this.tryLoadIconFiles(filenames, index + 1);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((svgContent: string | null) => {
        if (svgContent) {
          console.log(`✅ Successfully loaded: ${url}`);
          const processedSvg = this.processSvgContent(svgContent);
          const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedSvg);
          this._iconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
          this.cdr.markForCheck();
        }
      });
  }

  private processSvgContent(svgContent: string): string {
    let processedSvg = svgContent;
    
    // Replace hardcoded fill attributes with currentColor
    processedSvg = processedSvg.replace(/fill=["']#[a-fA-F0-9]{3,8}["']/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/fill=["']((?!none|currentColor|inherit)[a-zA-Z]+)["']/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/\s+/g, ' ');
    
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10l5 5 5-5z" fill="currentColor"/>
    </svg>`;
  }

  getIconHtml(): SafeHtml | null {
    return this._iconHtml();
  }

  // Lifecycle methods
  ngOnInit(): void {
    this.loadIcon();
  }

  ngOnChanges(): void {
    // Re-validate selected option when options change
    if (this.value && this.options.length) {
      const currentOption = this.options.find(opt => opt.value === this.value);
      if (!currentOption) {
        // Clear invalid selection
        this.value = '';
        this.onChange('');
        this.valueChange.emit('');
        this.selectionChange.emit(null);
      }
    }
  }

  ngAfterViewInit(): void {
    // Any post-render initialization if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  toggleDropdown(): void {
    if (this.disabled) return;
    
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (this.disabled) return;
    
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  closeDropdown(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.onTouched();
    this.cdr.markForCheck();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    
    this.value = option.value;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.selectionChange.emit(option);
    this.closeDropdown();
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusNextOption();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.focusPreviousOption();
        }
        break;
    }
  }

  onOptionKeydown(event: KeyboardEvent, option: SelectOption): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(option);
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        this.selectTrigger?.nativeElement.focus();
        break;
    }
  }

  private focusNextOption(): void {
    // Implementation for keyboard navigation
    const options = this.elementRef.nativeElement.querySelectorAll('.ms-select__option:not(.ms-select__option--disabled)');
    const activeElement = document.activeElement;
    const currentIndex = Array.from(options).indexOf(activeElement as Element);
    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    (options[nextIndex] as HTMLElement)?.focus();
  }

  private focusPreviousOption(): void {
    // Implementation for keyboard navigation
    const options = this.elementRef.nativeElement.querySelectorAll('.ms-select__option:not(.ms-select__option--disabled)');
    const activeElement = document.activeElement;
    const currentIndex = Array.from(options).indexOf(activeElement as Element);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    (options[previousIndex] as HTMLElement)?.focus();
  }

  trackByOption(index: number, option: SelectOption): any {
    return option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Public methods
  focus(): void {
    if (this.selectTrigger?.nativeElement && !this.disabled) {
      this.selectTrigger.nativeElement.focus();
    }
  }
}

// Unique ID counter
let nextUniqueId = 0;

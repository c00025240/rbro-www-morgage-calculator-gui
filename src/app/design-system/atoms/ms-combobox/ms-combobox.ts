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
import { catchError, of, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MsHelperComponent } from '../ms-helper/ms-helper';

export interface ComboboxOption {
  value: any;
  label: string;
  disabled?: boolean;
}

// Value accessor provider
const COMBOBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCombobox),
  multi: true,
};

@Component({
  selector: 'ms-combobox',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [COMBOBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-combobox">
      <!-- Label -->
      <label 
        *ngIf="label"
        class="ms-combobox__label"
        [class.ms-combobox__label--required]="required"
        [for]="comboboxId">
        {{ label }}
      </label>

      <!-- Combobox Container -->
      <div 
        class="ms-combobox__container"
        [class.ms-combobox__container--focused]="isOpen"
        [class.ms-combobox__container--error]="error"
        [class.ms-combobox__container--disabled]="disabled">
        
        <!-- Input Trigger -->
        <div class="ms-combobox__trigger">
          <input
            #inputElement
            class="ms-combobox__input"
            type="text"
            role="combobox"
            [id]="comboboxId"
            [placeholder]="currentPlaceholder"
            [value]="searchText"
            [disabled]="disabled"
            [attr.aria-label]="ariaLabel || label"
            [attr.aria-expanded]="isOpen"
            [attr.aria-haspopup]="'listbox'"
            [attr.aria-autocomplete]="'list'"
            [attr.aria-activedescendant]="activeDescendant"
            autocomplete="off"
            (input)="onInputChange($event)"
            (focus)="onInputFocus()"
            (keydown)="onKeydown($event)"
          />
          
          <!-- Clear button (when there's text and the dropdown is open) -->
          <button
            *ngIf="searchText && isOpen"
            class="ms-combobox__clear"
            type="button"
            tabindex="-1"
            aria-label="Șterge text"
            (click)="onClearClick($event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z"/>
            </svg>
          </button>

          <!-- Dropdown Icon -->
          <div 
            class="ms-combobox__icon"
            [class.ms-combobox__icon--open]="isOpen"
            (click)="onIconClick($event)"
            [innerHTML]="getIconHtml()">
          </div>
        </div>

        <!-- Dropdown Panel -->
        <div 
          *ngIf="isOpen"
          class="ms-combobox__dropdown"
          [attr.aria-labelledby]="comboboxId"
          role="listbox">
          
          <!-- Loading State -->
          <div *ngIf="loading" class="ms-combobox__status">
            <div class="ms-combobox__spinner"></div>
            <span>Se caută...</span>
          </div>

          <!-- Min Search Length Hint -->
          <div *ngIf="!loading && showMinLengthHint" class="ms-combobox__status">
            <span>Introdu minim {{ minSearchLength }} caractere</span>
          </div>

          <!-- No Results -->
          <div *ngIf="!loading && !showMinLengthHint && options.length === 0" class="ms-combobox__status">
            <span>{{ noResultsText }}</span>
          </div>

          <!-- Options List -->
          <div 
            *ngIf="!loading && !showMinLengthHint && options.length > 0"
            class="ms-combobox__options">
            <div
              *ngFor="let option of options; let i = index; trackBy: trackByOption"
              class="ms-combobox__option"
              [class.ms-combobox__option--selected]="option.value === value"
              [class.ms-combobox__option--highlighted]="i === highlightedIndex"
              [class.ms-combobox__option--disabled]="option.disabled"
              [attr.id]="comboboxId + '-option-' + i"
              [attr.aria-selected]="option.value === value"
              [attr.tabindex]="option.disabled ? -1 : 0"
              role="option"
              (click)="selectOption(option)"
              (mouseenter)="highlightedIndex = i">
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Helper Text -->
      <ms-helper 
        *ngIf="helperText"
        [surface]="surface"
        [state]="error ? 'error' : 'regular'"
        class="ms-combobox__helper">
        {{ helperText }}
      </ms-helper>
    </div>
  `,
  styleUrls: ['./ms-combobox.scss'],
})
export class MsCombobox implements ControlValueAccessor, OnInit, OnChanges, OnDestroy, AfterViewInit {
  
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() value: any = '';
  @Input() options: ComboboxOption[] = [];
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = false;
  @Input() helperText?: string;
  @Input() loading = false;
  @Input() minSearchLength = 2;
  @Input() noResultsText = 'Niciun rezultat';
  @Input() ariaLabel?: string;

  @Output() valueChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-combobox-component',
      `ms-combobox-component--surface-${this.surface}`,
      this.disabled ? 'ms-combobox-component--disabled' : '',
      this.error ? 'ms-combobox-component--error' : '',
      this.helperText ? 'ms-combobox-component--has-helper' : '',
      this.isOpen ? 'ms-combobox-component--open' : '',
    ].filter(Boolean).join(' ');
  }

  // Internal state
  public isOpen = false;
  public searchText = '';
  public highlightedIndex = -1;
  private _iconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  private _comboboxId = `ms-combobox-${nextUniqueId++}`;

  // Form control methods
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Computed properties
  public get comboboxId(): string {
    return this._comboboxId;
  }

  public get selectedOption(): ComboboxOption | null {
    return this.options.find(option => option.value === this.value) || null;
  }

  public get currentPlaceholder(): string {
    if (this.isOpen) {
      // When open, show selected value as placeholder hint
      const selected = this.findOptionByValue(this.value);
      return selected ? selected.label : (this.placeholder || 'Caută...');
    }
    return this.placeholder || 'Selectează o opțiune';
  }

  public get showMinLengthHint(): boolean {
    return this.searchText.length > 0 && this.searchText.length < this.minSearchLength;
  }

  public get activeDescendant(): string | null {
    if (this.highlightedIndex >= 0 && this.highlightedIndex < this.options.length) {
      return `${this._comboboxId}-option-${this.highlightedIndex}`;
    }
    return null;
  }

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

  // Lifecycle methods
  ngOnInit(): void {
    this.loadIcon();
    this.initializeSearchText();

    // Setup debounced search
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchText) => {
        if (searchText.length >= this.minSearchLength || searchText.length === 0) {
          this.searchChange.emit(searchText);
        }
      });
  }

  ngOnChanges(): void {
    // When value changes externally, update the display text
    if (!this.isOpen) {
      this.initializeSearchText();
    }
  }

  ngAfterViewInit(): void {
    // Any post-render initialization if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialize search text from current value
  private initializeSearchText(): void {
    const selected = this.findOptionByValue(this.value);
    this.searchText = selected ? selected.label : (this.value || '');
  }

  private findOptionByValue(val: any): ComboboxOption | null {
    if (!val && val !== 0) return null;
    return this.options.find(o => o.value === val) || null;
  }

  // Event handlers
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.highlightedIndex = -1;
    
    if (!this.isOpen) {
      this.openDropdown();
    }

    // Emit through debounced subject
    this.searchSubject$.next(this.searchText);
  }

  onInputFocus(): void {
    if (!this.isOpen && !this.disabled) {
      // Clear text to allow typing, show dropdown
      this.searchText = '';
      this.openDropdown();
      // Emit empty search to load initial results
      this.searchSubject$.next('');
    }
  }

  onIconClick(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.searchText = '';
      this.openDropdown();
      this.searchSubject$.next('');
      // Focus the input when opening via icon
      setTimeout(() => this.inputElement?.nativeElement.focus(), 0);
    }
  }

  onClearClick(event: Event): void {
    event.stopPropagation();
    this.searchText = '';
    this.highlightedIndex = -1;
    this.searchSubject$.next('');
    this.inputElement?.nativeElement.focus();
  }

  openDropdown(): void {
    if (this.disabled || this.isOpen) return;
    
    this.isOpen = true;
    this.highlightedIndex = -1;
    this.opened.emit();
    this.cdr.markForCheck();
  }

  closeDropdown(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.highlightedIndex = -1;
    
    // Restore display text to selected value
    this.initializeSearchText();
    
    this.onTouched();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  selectOption(option: ComboboxOption): void {
    if (option.disabled) return;
    
    this.value = option.value;
    this.searchText = option.label;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.closeDropdown();
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.moveHighlight(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.moveHighlight(-1);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen && this.highlightedIndex >= 0 && this.highlightedIndex < this.options.length) {
          const option = this.options[this.highlightedIndex];
          if (!option.disabled) {
            this.selectOption(option);
          }
        } else if (!this.isOpen) {
          this.openDropdown();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        // Close dropdown on tab, let focus move naturally
        this.closeDropdown();
        break;
    }
  }

  private moveHighlight(direction: number): void {
    const enabledOptions = this.options.filter(o => !o.disabled);
    if (enabledOptions.length === 0) return;

    let newIndex = this.highlightedIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = this.options.length - 1;
    if (newIndex >= this.options.length) newIndex = 0;

    // Skip disabled options
    while (this.options[newIndex]?.disabled) {
      newIndex += direction;
      if (newIndex < 0) newIndex = this.options.length - 1;
      if (newIndex >= this.options.length) newIndex = 0;
    }

    this.highlightedIndex = newIndex;

    // Scroll highlighted option into view
    const optionEl = this.elementRef.nativeElement.querySelector(
      `#${this._comboboxId}-option-${newIndex}`
    );
    optionEl?.scrollIntoView({ block: 'nearest' });

    this.cdr.markForCheck();
  }

  trackByOption(index: number, option: ComboboxOption): any {
    return option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
    this.initializeSearchText();
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
    if (this.inputElement?.nativeElement && !this.disabled) {
      this.inputElement.nativeElement.focus();
    }
  }

  // Icon loading methods (same approach as ms-select)
  private loadIcon(): void {
    const iconName = 'select-open-down';
    const possibleFilenames = [
      `${iconName}.svg`,
      `${iconName}-outlined.svg`,
      `${iconName} Style=outlined.svg`,
      `${iconName} Style=Outlined.svg`,
      `${iconName} Style=outline.svg`
    ];
    this.tryLoadIconFiles(possibleFilenames, 0);
  }

  private tryLoadIconFiles(filenames: string[], index: number): void {
    if (index >= filenames.length) {
      const fallbackSvg = this.getFallbackIconSvg();
      const processedFallback = this.processSvgContent(fallbackSvg);
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedFallback);
      if (sanitized) {
        this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(sanitized));
      }
      this.cdr.markForCheck();
      return;
    }

    const filename = filenames[index];
    const url = `/assets/icons/${encodeURIComponent(filename)}`;

    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.tryLoadIconFiles(filenames, index + 1);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((svgContent: string | null) => {
        if (svgContent) {
          const processedSvg = this.processSvgContent(svgContent);
          const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedSvg);
          if (sanitized) {
            this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(sanitized));
          }
          this.cdr.markForCheck();
        }
      });
  }

  private processSvgContent(svgContent: string): string {
    let processedSvg = svgContent;
    processedSvg = processedSvg.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*{[^}]*}/gi, '');
    processedSvg = processedSvg.replace(/javascript:/gi, '');
    processedSvg = processedSvg.replace(/fill=["']#[a-fA-F0-9]{3,8}["']/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/fill=["']((?!none|currentColor|inherit)[a-zA-Z]+)["']/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/<path([^>]*?)fill="[^"]*"([^>]*?)>/g, (match, before, after) => {
      return `<path${before}${after} fill="currentColor">`;
    });
    processedSvg = processedSvg.replace(/\s+/g, ' ');
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9999 14.4393L19.2928 7.14641L20.707 8.56062L12.707 16.5606C12.3165 16.9511 11.6833 16.9511 11.2928 16.5606L3.29282 8.56062L4.70703 7.14641L11.9999 14.4393Z" fill="currentColor"/>
    </svg>`;
  }

  getIconHtml(): SafeHtml | null {
    return this._iconHtml();
  }
}

// Unique ID counter
let nextUniqueId = 0;

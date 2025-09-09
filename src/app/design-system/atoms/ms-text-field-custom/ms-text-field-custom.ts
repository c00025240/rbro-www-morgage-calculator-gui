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

// Value accessor provider
const TEXT_FIELD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsTextFieldCustomComponent),
  multi: true,
};

@Component({
  selector: 'ms-text-field-custom',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [TEXT_FIELD_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-text-field">
      <!-- Label -->
      <label 
        *ngIf="label"
        class="ms-text-field__label"
        [class.ms-text-field__label--required]="required"
        [for]="inputId">
        {{ label }}
      </label>

      <!-- Input Container -->
      <div 
        class="ms-text-field__input-container"
        [class.ms-text-field__input-container--focused]="isFocused"
        [class.ms-text-field__input-container--error]="error"
        [class.ms-text-field__input-container--disabled]="disabled">
        
        <!-- Input or Textarea -->
        <input
          *ngIf="!isTextarea"
          #inputElement
          class="ms-text-field__input"
          [id]="inputId"
          [type]="type"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [maxLength]="maxLength"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="ariaDescribedby"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (keydown)="onKeydown($event)" />

        <textarea
          *ngIf="isTextarea"
          #textareaElement
          class="ms-text-field__textarea"
          [class.ms-text-field__textarea--resizable]="resizable"
          [id]="inputId"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [maxLength]="maxLength"
          [rows]="rows || 3"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="ariaDescribedby"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (keydown)="onKeydown($event)">
        </textarea>

        <!-- Character Count -->
        <div 
          *ngIf="showCharacterCount && maxLength"
          class="ms-text-field__character-count"
          [attr.aria-live]="'polite'">
          {{ currentLength }}/{{ maxLength }}
        </div>

        <!-- Suffix Area -->
        <div 
          *ngIf="suffixText || suffixIcon"
          class="ms-text-field__suffix">
          
          <!-- Divider -->
          <div class="ms-text-field__suffix-divider"></div>
          
          <!-- Suffix Text -->
          <span 
            *ngIf="suffixText"
            class="ms-text-field__suffix-text">
            {{ suffixText }}
          </span>
          
          <!-- Suffix Icon -->
          <div 
            *ngIf="suffixIcon"
            class="ms-text-field__suffix-icon"
            [innerHTML]="getIconHtml()">
          </div>
        </div>

        <!-- Resize Handle for Textarea -->
        <div 
          *ngIf="isTextarea && !resizable"
          class="ms-text-field__resize-handle">
        </div>
      </div>

      <!-- Helper Text -->
      <ms-helper 
        *ngIf="helperText"
        [state]="error ? 'error' : 'regular'"
        class="ms-text-field__helper">
        {{ helperText }}
      </ms-helper>
    </div>
  `,
  styleUrls: ['./ms-text-field-custom.scss'],
})
export class MsTextFieldCustomComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy, AfterViewInit {
  
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() value: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = false;
  @Input() helperText?: string;
  @Input() suffixText?: string;
  @Input() suffixIcon?: string;
  @Input() showCharacterCount = false;
  @Input() maxLength?: number = 50;
  @Input() rows?: number;
  @Input() autoResize = false;
  @Input() resizable = false;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-text-field-custom',
      `ms-text-field-custom--surface-${this.surface}`,
      this.disabled ? 'ms-text-field-custom--disabled' : '',
      this.error ? 'ms-text-field-custom--error' : '',
      this.helperText ? 'ms-text-field-custom--has-helper' : '',
      this.isTextarea ? 'ms-text-field-custom--textarea' : '',
    ].filter(Boolean).join(' ');
  }

  // Internal state
  public isFocused = false;
  private _touched = false;
  private _iconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();

  // Internal computed properties
  public get isTextarea(): boolean {
    return !!this.rows;
  }

  public get currentLength(): number {
    return this.value?.length || 0;
  }

  public get inputId(): string {
    return this._inputId;
  }

  public get nativeElement(): HTMLInputElement | HTMLTextAreaElement {
    return this.inputElement?.nativeElement || this.textareaElement?.nativeElement!;
  }

  private _inputId = `ms-text-field-${nextUniqueId++}`;

  // Form control methods
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  // Icon loading methods (adapted from button-bare)
  private loadIcon(iconName: string): void {
    console.log(`📁 Loading icon: ${iconName}`);
    // Try different filename patterns that exist in the assets folder
    const possibleFilenames = [
      `${iconName}-outlined.svg`,           // e.g., search-outlined.svg (PRIORITY - works reliably)
      `${iconName}.svg`,                    // e.g., search.svg (single file icons)
      `${iconName} Style=outlined.svg`,     // e.g., search Style=outlined.svg
      `${iconName} Style=Outlined.svg`,     // e.g., search Style=Outlined.svg (capital O)
      `${iconName} Style=outline.svg`       // e.g., search Style=outline.svg (no d)
    ];

    console.log(`🔍 Will try these filenames:`, possibleFilenames);
    this.tryLoadIconFiles(possibleFilenames, 0);
  }

  private tryLoadIconFiles(filenames: string[], index: number): void {
    if (index >= filenames.length) {
      console.warn(`❌ Could not load icon: ${this.suffixIcon}. Tried all patterns.`);
      const fallbackSvg = this.getFallbackIconSvg();
      const processedFallback = this.processSvgContent(fallbackSvg);
      this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(processedFallback));
      return;
    }

    const filename = filenames[index];
    // Always use proper URL encoding - Angular HttpClient handles this correctly
    const url = `/assets/icons/${encodeURIComponent(filename)}`;
    
    console.log(`🌐 Trying to load: ${url}`);

    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.log(`⚠️ Failed to load ${url}, trying next...`, error);
          // Try next filename pattern
          this.tryLoadIconFiles(filenames, index + 1);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((svgContent: string | null) => {
        if (svgContent) {
          console.log(`✅ Successfully loaded: ${url}`);
          // Process SVG to remove hardcoded fills before injection
          const processedSvg = this.processSvgContent(svgContent);
          this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(processedSvg));
          this.cdr.markForCheck();
        }
      });
  }

  private processSvgContent(svgContent: string): string {
    // Replace hardcoded fill attributes with currentColor for proper color inheritance
    let processedSvg = svgContent;
    
    // Replace fill attributes with hex color values with currentColor (but keep fill="none")
    processedSvg = processedSvg.replace(/fill=["']#[a-fA-F0-9]{3,8}["']/g, 'fill="currentColor"');
    
    // Replace fill attributes with named colors with currentColor (but preserve fill="none", fill="currentColor", fill="inherit")
    processedSvg = processedSvg.replace(/fill=["']((?!none|currentColor|inherit)[a-zA-Z]+)["']/g, 'fill="currentColor"');
    
    // Clean up any double spaces that might result from replacements
    processedSvg = processedSvg.replace(/\s+/g, ' ');
    
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    // Provide a simple fallback SVG string (to be processed like other SVGs)
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="12" y="14" text-anchor="middle" font-size="10" fill="currentColor">${this.suffixIcon?.charAt(0).toUpperCase() || '?'}</text>
    </svg>`;
  }

  getIconHtml(): SafeHtml | null {
    return this._iconHtml();
  }

  // Lifecycle methods
  ngOnInit(): void {
    if (this.suffixIcon && !this.suffixIcon.includes('<svg')) {
      // If suffixIcon doesn't contain SVG markup, treat it as an icon name
      console.log(`🔍 Text field initializing with icon: ${this.suffixIcon}`);
      this.loadIcon(this.suffixIcon);
    } else if (this.suffixIcon) {
      // If it contains SVG markup, use it directly
      this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(this.suffixIcon));
    }
  }

  ngOnChanges(): void {
    if (this.suffixIcon) {
      if (!this.suffixIcon.includes('<svg')) {
        // If suffixIcon doesn't contain SVG markup, treat it as an icon name
        console.log(`🔄 Text field icon changed to: ${this.suffixIcon}`);
        this.loadIcon(this.suffixIcon);
      } else {
        // If it contains SVG markup, use it directly
        this._iconHtml.set(this.sanitizer.bypassSecurityTrustHtml(this.suffixIcon));
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.autoResize && this.isTextarea) {
      this.adjustTextareaHeight();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const newValue = target.value;
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);

    if (this.autoResize && this.isTextarea) {
      this.adjustTextareaHeight();
    }
  }

  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.onTouched();
    this.blur.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    // Handle specific keyboard interactions if needed
    if (event.key === 'Enter' && this.isTextarea && !event.shiftKey) {
      // Optional: Handle Enter key behavior for textarea
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
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
  focusInput(): void {
    if (this.nativeElement && !this.disabled) {
      this.nativeElement.focus();
    }
  }

  selectAll(): void {
    if (this.nativeElement && !this.disabled) {
      this.nativeElement.select();
    }
  }

  // Private methods
  private adjustTextareaHeight(): void {
    if (!this.textareaElement?.nativeElement) return;

    const textarea = this.textareaElement.nativeElement;
    // Reset height to auto to get the natural height
    textarea.style.height = 'auto';
    // Set height to scrollHeight to fit content
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

// Unique ID counter
let nextUniqueId = 0; 
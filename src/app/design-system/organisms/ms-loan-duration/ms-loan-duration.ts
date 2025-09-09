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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, filter } from 'rxjs';
import { MsTextFieldCustomComponent } from '../../atoms/ms-text-field-custom/ms-text-field-custom';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';

// Value accessor provider
const LOAN_DURATION_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsLoanDurationComponent),
  multi: true,
};

@Component({
  selector: 'ms-loan-duration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MsTextFieldCustomComponent, MsCard, MsCardOutsideTitleComponent],
  providers: [LOAN_DURATION_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-loan-duration">
      <!-- Title without helper using ms-card-outside-title -->
      <ms-card-outside-title
        *ngIf="label"
        [title]="label"
        [hasHelper]="false">
      </ms-card-outside-title>

      <!-- Card wrapper for content -->
      <ms-card>
        <div class="ms-loan-duration__content">
          <!-- Field Section -->
          <div class="ms-loan-duration__field-section">
            <ms-text-field-custom
              #textField
              [placeholder]="placeholder"
              [error]="hasInputError"
              [helperText]="currentHelperText"
              [suffixText]="suffix"
              [type]="'text'"
              [formControl]="inputControl"
              (focus)="onInputFocus()"
              (blur)="onInputBlur()">
            </ms-text-field-custom>
          </div>

          <!-- Slider Section -->
          <div class="ms-loan-duration__slider-section">
            <div class="ms-loan-duration__slider"
                 (touchstart)="onSliderTouchStart($event)"
                 (touchmove)="onSliderTouchMove($event)">
              <!-- Background track -->
              <div class="ms-loan-duration__slider-track"></div>
              <!-- Active track -->
              <div class="ms-loan-duration__slider-progress" [style.width.%]="progressPercentage"></div>
              <!-- Slider handle -->
              <div class="ms-loan-duration__slider-handle" [style.left.%]="progressPercentage"></div>
              <!-- Input (invisible) -->
              <input
                type="range"
                class="ms-loan-duration__slider-input"
                [min]="min"
                [max]="max"
                [step]="step"
                [formControl]="sliderControl"
                [attr.aria-label]="'Loan duration slider'"
                (touchstart)="onSliderInputTouchStart($event)"
                (touchmove)="onSliderInputTouchMove($event)">
            </div>
          </div>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-loan-duration.scss'],
})
export class MsLoanDurationComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  
  @Input() label?: string = 'Perioada imprumutului';
  @Input() placeholder: string = '360';
  @Input() suffix: string = 'luni';
  @Input() min: number = 12; // 1 year minimum
  @Input() max: number = 360; // 30 years maximum
  @Input() step: number = 6; // 6 month increments
  @Input() disabled = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'dark';

  @Output() valueChange = new EventEmitter<number>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  @ViewChild('textField') textField?: MsTextFieldCustomComponent;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-loan-duration',
      `ms-loan-duration--surface-${this.surface}`,
      this.disabled ? 'ms-loan-duration--disabled' : '',
      this.inputControl.invalid && this.inputControl.touched ? 'ms-loan-duration--error' : '',
    ].filter(Boolean).join(' ');
  }

  // Map surface types to card surface types
  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  // Core FormControls for loan duration in months
  inputControl = new FormControl('360');   // String for text field (default 30 years)
  sliderControl = new FormControl(360);    // Number for slider (default 30 years)

  // State management
  isInputFocused = false;
  private destroy$ = new Subject<void>();

  // Form control methods for ControlValueAccessor
  private onChange = (value: number) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Update validators with current min/max values
    this.inputControl.setValidators([
      Validators.required,
      Validators.min(this.min),
      Validators.max(this.max)
    ]);
    
    // Initialize FormControls with current min value
    this.inputControl.setValue(this.min.toString(), { emitEvent: false });
    this.sliderControl.setValue(this.min, { emitEvent: false });

    this.setupSynchronization();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.setDisabledState(changes['disabled'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this.inputControl.setValue(value.toString(), { emitEvent: false });
      this.sliderControl.setValue(value, { emitEvent: false });
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.inputControl.disable();
      this.sliderControl.disable();
    } else {
      this.inputControl.enable();
      this.sliderControl.enable();
    }
    this.cdr.markForCheck();
  }

  get progressPercentage(): number {
    const value = this.sliderControl.value || this.min;
    const percentage = ((value - this.min) / (this.max - this.min)) * 100;
    // Ensure the handle stays within proper bounds (handle width is 28px, so we need about 14px margin)
    // The percentage calculation should map:
    // min value -> 14px from left edge (approximately 2-5% depending on container width)
    // max value -> 14px from right edge (approximately 95-98% depending on container width)
    const minPercentage = 2; // Start slightly inward from left edge
    const maxPercentage = 98; // End slightly inward from right edge
    return minPercentage + (percentage * (maxPercentage - minPercentage) / 100);
  }

  // Core synchronization logic - using text field's value API
  private setupSynchronization(): void {
    
    // SLIDER → INPUT (live updates, but only when input is not focused)
    this.sliderControl.valueChanges
      .pipe(
        filter(() => !this.isInputFocused),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value !== null) {
          this.inputControl.setValue(value.toString(), { emitEvent: false });
          this.valueChange.emit(value);
          this.onChange(value);
          this.cdr.markForCheck();
        }
      });

    // INPUT → SLIDER synchronization removed from here
    // This will now only happen in onInputBlur() to prevent overwriting user input
  }

  // Event handlers
  onInputFocus(): void {
    this.isInputFocused = true;
    this.focused.emit();
    this.cdr.markForCheck();
  }

  onInputBlur(): void {
    this.isInputFocused = false;
    
    // Parse and validate the current input value
    const textValue = this.inputControl.value || '';
    const numericValue = parseInt(textValue, 10) || this.min;
    const clampedValue = Math.max(this.min, Math.min(this.max, numericValue));
    
    // Format and update the input field with the final value
    this.inputControl.setValue(clampedValue.toString(), { emitEvent: false });
    
    // Sync the slider to match the validated input value
    this.sliderControl.setValue(clampedValue, { emitEvent: false });
    
    // Emit the change events
    this.valueChange.emit(clampedValue);
    this.onChange(clampedValue);
    
    this.onTouched();
    this.blurred.emit();
    this.cdr.markForCheck();
  }

  // Slider touch event handlers to prevent horizontal page scrolling
  onSliderTouchStart(event: TouchEvent): void {
    // Allow the touch event to propagate normally for slider functionality
    // but mark that we're in a slider interaction
  }

  onSliderTouchMove(event: TouchEvent): void {
    // Prevent horizontal page scrolling during slider interaction
    if (event.touches.length === 1) {
      // Single finger - prevent default to stop page scrolling
      event.preventDefault();
    }
  }

  onSliderInputTouchStart(event: TouchEvent): void {
    // Allow the touch event for slider functionality
  }

  onSliderInputTouchMove(event: TouchEvent): void {
    // Prevent horizontal page scrolling during slider input interaction
    if (event.touches.length === 1) {
      // Single finger - prevent default to stop page scrolling
      event.preventDefault();
    }
  }

  // Computed properties
  get currentHelperText(): string {
    const textValue = this.inputControl.value || '360';
    const currentValue = parseInt(textValue, 10) || this.min;
    
    // Show validation error for out-of-range values
    if (currentValue < this.min || currentValue > this.max) {
      return `Durata trebuie să fie între ${this.min} și ${this.max} luni`;
    }
    
    // Show the full helper text with calculated years/months
    const displayText = this.getDisplayText(currentValue);
    return `${displayText}, insemnand ca ai maxim X ani in acest moment`;
  }

  get hasInputError(): boolean {
    const textValue = this.inputControl.value || '360';
    const currentValue = parseInt(textValue, 10) || this.min;
    return currentValue < this.min || currentValue > this.max;
  }

  // Helper method to convert months to years and months display
  getDisplayText(months: number): string {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} lun${remainingMonths !== 1 ? 'i' : 'a'}`;
    } else if (remainingMonths === 0) {
      return `${years} an${years !== 1 ? 'i' : ''}`;
    } else {
      return `${years} an${years !== 1 ? 'i' : ''} si ${remainingMonths} lun${remainingMonths !== 1 ? 'i' : 'a'}`;
    }
  }

  // Public methods
  focusField(): void {
    this.textField?.focusInput();
  }

  selectAll(): void {
    this.textField?.selectAll();
  }
} 
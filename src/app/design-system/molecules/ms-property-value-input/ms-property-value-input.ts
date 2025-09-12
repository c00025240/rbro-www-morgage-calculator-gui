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
import { MsCard } from '../ms-card/ms-card';
import { MsCardOutsideTitleComponent } from '../ms-card-outside-title/ms-card-outside-title';

// Value accessor provider
const PROPERTY_VALUE_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsPropertyValueInputComponent),
  multi: true,
};

@Component({
  selector: 'ms-property-value-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MsTextFieldCustomComponent, MsCard, MsCardOutsideTitleComponent],
  providers: [PROPERTY_VALUE_INPUT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-property-value">
      <!-- Title with Helper using ms-card-outside-title -->
      <ms-card-outside-title
        *ngIf="label"
        [title]="label"
        [helperText]="helperText"
        [hasHelper]="!!helperText"
        [surface]="surface">
      </ms-card-outside-title>

      <!-- Content Card using ms-card component -->
      <ms-card [surface]="cardSurface" class="ms-property-value__content">
        <!-- Text Field -->
        <div class="ms-property-value__field-section">
          <!-- FIXED TEXT FIELD COMPONENT -->
          <ms-text-field-custom
            #textField
            [placeholder]="placeholder"
            [error]="hasInputError"
            [helperText]="currentHelperText"
            [suffixText]="currency"
            [type]="'text'"
            [formControl]="inputControl"
            [surface]="surface"
            (focus)="onInputFocus()"
            (blur)="onInputBlur()">
          </ms-text-field-custom>
        </div>

        <!-- Slider -->
        <div class="ms-property-value__slider-section">
          <div class="ms-property-value__slider"
               (touchstart)="onSliderTouchStart($event)"
               (touchmove)="onSliderTouchMove($event)">
            <!-- Background track -->
            <div class="ms-property-value__slider-track"></div>
            <!-- Active track -->
            <div class="ms-property-value__slider-progress" [style.width.%]="progressPercentage"></div>
            <!-- Slider handle -->
            <div class="ms-property-value__slider-handle" [style.left.%]="progressPercentage"></div>
            <!-- Input (invisible) -->
            <input
              type="range"
              class="ms-property-value__slider-input"
              [min]="min"
              [max]="max"
              [step]="step"
              [formControl]="sliderControl"
              [attr.aria-label]="'Property value slider'"
              (touchstart)="onSliderInputTouchStart($event)"
              (touchmove)="onSliderInputTouchMove($event)">
          </div>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-property-value-input.scss'],
})
export class MsPropertyValueInputComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  
  @Input() label?: string;
  @Input() helperText?: string;
  @Input() placeholder: string = '0';
  @Input() currency: string = 'RON';
  @Input() min: number = 100000;
  @Input() max: number = 1000000;
  @Input() step: number = 5000;
  @Input() eurConversionRate: number = 5.0;
  @Input() disabled = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() value?: number; // default value from parent

  @Output() valueChange = new EventEmitter<number>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  @ViewChild('textField') textField?: MsTextFieldCustomComponent;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-property-value-input',
      `ms-property-value-input--surface-${this.surface}`,
      this.disabled ? 'ms-property-value-input--disabled' : '',
      this.inputControl.invalid && this.inputControl.touched ? 'ms-property-value-input--error' : '',
    ].filter(Boolean).join(' ');
  }

  // Map surface types to card surface types
  get cardSurface(): 'light' | 'dark' {
    return this.surface === 'dark' ? 'dark' : 'light';
  }

  // Core FormControls following the PRD pattern
  inputControl = new FormControl('100000');   // String for text field
  sliderControl = new FormControl(100000);    // Number for slider

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
    
    // Initialize with provided default value if given, otherwise keep current defaults
    if (typeof this.value === 'number' && !Number.isNaN(this.value)) {
      const clamped = Math.max(this.min, Math.min(this.max, this.value));
      this.inputControl.setValue(clamped.toString(), { emitEvent: false });
      this.sliderControl.setValue(clamped, { emitEvent: false });
    } else {
      // Ensure defaults are within bounds
      const def = Math.max(this.min, Math.min(this.max, Number(this.inputControl.value) || this.min));
      this.inputControl.setValue(def.toString(), { emitEvent: false });
      this.sliderControl.setValue(def, { emitEvent: false });
    }

    this.setupSynchronization();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.setDisabledState(changes['disabled'].currentValue);
    }
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

    // INPUT (typing) → emit instant value changes
    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(textValue => {
        const numericValue = parseInt(textValue || '', 10);
        if (!Number.isNaN(numericValue)) {
          const clampedValue = Math.max(this.min, Math.min(this.max, numericValue));
          this.valueChange.emit(clampedValue);
          this.onChange(clampedValue);
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
    const textValue = this.inputControl.value || '100000';
    const currentValue = parseInt(textValue, 10) || this.min;
    
    // Show validation error for out-of-range values
    if (currentValue < this.min || currentValue > this.max) {
      return `Valoarea trebuie să fie între ${this.formatCurrency(this.min)} și ${this.formatCurrency(this.max)} ${this.currency}`;
    }
    
    // EUR conversion helper for valid values
    const eurValue = Math.round(currentValue / this.eurConversionRate);
    return `≈ ${this.formatCurrency(eurValue)} EUR (curs estimativ: 1 EUR = ${this.eurConversionRate} ${this.currency})`;
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

  get hasInputError(): boolean {
    const textValue = this.inputControl.value || '100000';
    const currentValue = parseInt(textValue, 10) || this.min;
    return currentValue < this.min || currentValue > this.max;
  }



  // Utility methods
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('ro-RO').format(value);
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
    if (isDisabled) {
      this.inputControl.disable();
      this.sliderControl.disable();
    } else {
      this.inputControl.enable();
      this.sliderControl.enable();
    }
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Public methods
  focusField(): void {
    this.textField?.focusInput();
  }

  selectAll(): void {
    this.textField?.selectAll();
  }
} 
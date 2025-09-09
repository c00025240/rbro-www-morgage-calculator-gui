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
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsHelperComponent } from '../ms-helper/ms-helper';

export type SliderSurface = 'default' | 'light' | 'dark';

// Value accessor provider
const SLIDER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsSliderCustomComponent),
  multi: true,
};

@Component({
  selector: 'ms-slider-custom',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [SLIDER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-slider-container">
            <label 
        *ngIf="label"
        class="ms-slider__label"
        [attr.id]="labelId"
        [for]="inputId">
        {{ label }}
      </label>
      
      <div class="ms-slider-wrapper">
        <div 
          #sliderTrack
          class="ms-slider__track"
          (mousedown)="onTrackClick($event)"
          (touchstart)="onTrackTouch($event)">
          
          <!-- Progress fill -->
          <div 
            class="ms-slider__progress"
            [style.width.%]="progressPercentage">
          </div>
          
          <!-- Thumb -->
          <div 
            #sliderThumb
            class="ms-slider__thumb"
            [style.left.%]="progressPercentage"
            [attr.aria-valuemin]="min"
            [attr.aria-valuemax]="max"
            [attr.aria-valuenow]="value"
            [attr.aria-label]="ariaLabel"
            [attr.aria-labelledby]="label ? labelId : null"
            [attr.aria-describedby]="helperText ? helperId : ariaDescribedby"
            role="slider"
            tabindex="0"
            (keydown)="onKeyDown($event)"
            (focus)="onFocus()"
            (blur)="onBlur()"
            (mousedown)="onThumbMouseDown($event)"
            (touchstart)="onThumbTouchStart($event)">
            
            <!-- Value display tooltip -->
            <div 
              *ngIf="showValue && (isActive || alwaysShowValue)"
              class="ms-slider__value-display">
              {{ formattedValue }}
            </div>
          </div>
        </div>
        
        <!-- Min/Max labels -->
        <div *ngIf="showMinMax" class="ms-slider__labels">
          <span class="ms-slider__label-min">{{ formatValue(min) }}</span>
          <span class="ms-slider__label-max">{{ formatValue(max) }}</span>
        </div>
      </div>
      
      <!-- Helper Text -->
      <ms-helper 
        *ngIf="helperText"
        [surface]="surface"
        [state]="error ? 'error' : 'regular'"
        class="ms-slider__helper">
        {{ helperText }}
      </ms-helper>
    </div>
    
    <!-- Hidden input for form integration -->
    <input
      #hiddenInput
      type="range"
      [id]="inputId"
      [value]="value"
      [min]="min"
      [max]="max"
      [step]="step"
      [disabled]="disabled"
      [required]="required"
      aria-hidden="true"
      tabindex="-1"
      style="position: absolute; opacity: 0; pointer-events: none;"
      (input)="onInputChange($event)"
      (change)="onInputChange($event)" />
  `,
  styleUrls: ['./ms-slider-custom.scss'],
})
export class MsSliderCustomComponent implements ControlValueAccessor, OnInit, OnDestroy {
  
  @Input() label?: string;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() surface: SliderSurface = 'default';
  @Input() disabled = false;
  @Input() error = false;
  @Input() required = false;
  @Input() showValue = true;
  @Input() alwaysShowValue = false;
  @Input() showMinMax = false;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;
  @Input() helperText?: string;
  @Input() formatValue: (value: number) => string = (value: number) => value.toString();
  
  @Output() valueChange = new EventEmitter<number>();

  get labelId(): string | null { return this.label ? `${this.inputId}-label` : null; }
  get helperId(): string | null { return this.helperText ? `${this.inputId}-helper` : null; }

  @ViewChild('sliderTrack', { static: true }) sliderTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderThumb', { static: true }) sliderThumb!: ElementRef<HTMLDivElement>;
  @ViewChild('hiddenInput', { static: true }) hiddenInput!: ElementRef<HTMLInputElement>;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-slider-custom',
      `ms-slider-custom--surface-${this.surface}`,
      this.disabled ? 'ms-slider-custom--disabled' : '',
      this.error ? 'ms-slider-custom--error' : '',
      this.isActive ? 'ms-slider-custom--active' : '',
      this.isDragging ? 'ms-slider-custom--dragging' : '',
    ].filter(Boolean).join(' ');
  }

  inputId = `ms-slider-${Math.random().toString(36).substr(2, 9)}`;
  
  private _value: number = 0;
  private _touched = false;
  private isDragging = false;
  public isActive = false;
  
  // ControlValueAccessor callbacks
  private onChange = (value: number) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    this.validateInputs();
  }

  ngOnDestroy() {
    this.removeGlobalListeners();
  }

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    const newValue = this.clampValue(val);
    if (newValue !== this._value) {
      this._value = newValue;
      this.onChange(newValue);
      this.valueChange.emit(newValue);
      this.cdr.markForCheck();
    }
  }

  get progressPercentage(): number {
    if (this.max === this.min) return 0;
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  get formattedValue(): string {
    return this.formatValue(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this._value = this.clampValue(value || 0);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Event handlers
  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;
    
    event.preventDefault();
    const newValue = this.getValueFromMouseEvent(event);
    this.value = newValue;
    this.markAsTouched();
  }

  onTrackTouch(event: TouchEvent): void {
    if (this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    const newValue = this.getValueFromTouchEvent(event);
    this.value = newValue;
    this.markAsTouched();
    
    // Start dragging immediately on track touch for better mobile UX
    this.startDragging();
    this.addGlobalTouchListeners();
  }

  onThumbMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.startDragging();
    this.addGlobalMouseListeners();
  }

  onThumbTouchStart(event: TouchEvent): void {
    if (this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.startDragging();
    this.addGlobalTouchListeners();
    
    // Add haptic feedback for mobile if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration for touch feedback
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onGlobalMouseMove(event: MouseEvent): void {
    if (this.isDragging && !this.disabled) {
      const newValue = this.getValueFromMouseEvent(event);
      this.value = newValue;
    }
  }

  @HostListener('document:mouseup')
  onGlobalMouseUp(): void {
    if (this.isDragging) {
      this.stopDragging();
      this.removeGlobalListeners();
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onGlobalTouchMove(event: TouchEvent): void {
    if (this.isDragging && !this.disabled) {
      event.preventDefault(); // Prevent page scrolling during drag
      const newValue = this.getValueFromTouchEvent(event);
      this.value = newValue;
    }
  }

  @HostListener('document:touchend')
  onGlobalTouchEnd(): void {
    if (this.isDragging) {
      this.stopDragging();
      this.removeGlobalListeners();
      
      // Add subtle haptic feedback on release
      if ('vibrate' in navigator) {
        navigator.vibrate(5); // Very short vibration for release feedback
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    let delta = 0;
    const largeStep = this.step * 10;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = this.step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -this.step;
        break;
      case 'PageUp':
        delta = largeStep;
        break;
      case 'PageDown':
        delta = -largeStep;
        break;
      case 'Home':
        this.value = this.min;
        this.markAsTouched();
        event.preventDefault();
        return;
      case 'End':
        this.value = this.max;
        this.markAsTouched();
        event.preventDefault();
        return;
      default:
        return;
    }

    if (delta !== 0) {
      event.preventDefault();
      this.value = this.value + delta;
      this.markAsTouched();
    }
  }

  onFocus(): void {
    this.isActive = true;
    this.cdr.markForCheck();
  }

  onBlur(): void {
    this.isActive = false;
    this.markAsTouched();
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);
    this.markAsTouched();
  }

  // Private methods
  private validateInputs(): void {
    if (this.min >= this.max) {
      console.warn('MsSliderCustom: min value should be less than max value');
    }
    if (this.step <= 0) {
      console.warn('MsSliderCustom: step should be greater than 0');
    }
  }

  private clampValue(value: number): number {
    const clamped = Math.max(this.min, Math.min(this.max, value));
    return Math.round(clamped / this.step) * this.step;
  }

  private getValueFromMouseEvent(event: MouseEvent): number {
    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    return this.getValueFromPercentage(percentage);
  }

  private getValueFromTouchEvent(event: TouchEvent): number {
    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const touch = event.touches[0] || event.changedTouches[0];
    const percentage = (touch.clientX - rect.left) / rect.width;
    return this.getValueFromPercentage(percentage);
  }

  private getValueFromPercentage(percentage: number): number {
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    return this.min + (clampedPercentage * (this.max - this.min));
  }

  private startDragging(): void {
    this.isDragging = true;
    this.isActive = true;
    this.cdr.markForCheck();
  }

  private stopDragging(): void {
    this.isDragging = false;
    this.isActive = false;
    this.markAsTouched();
    this.cdr.markForCheck();
  }

  private addGlobalMouseListeners(): void {
    // Event listeners are added via HostListener decorators
  }

  private addGlobalTouchListeners(): void {
    // Event listeners are added via HostListener decorators
  }

  private removeGlobalListeners(): void {
    // HostListener automatically removes listeners
  }

  private markAsTouched(): void {
    if (!this._touched) {
      this._touched = true;
      this.onTouched();
    }
  }
} 
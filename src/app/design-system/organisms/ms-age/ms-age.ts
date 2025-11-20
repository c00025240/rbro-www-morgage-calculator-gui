import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
  HostBinding,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil, filter } from 'rxjs';
import { MsTextFieldCustomComponent } from '../../atoms/ms-text-field-custom/ms-text-field-custom';
import { MsHelperComponent } from '../../atoms/ms-helper/ms-helper';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';

const AGE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsAgeComponent),
  multi: true,
};

@Component({
  selector: 'ms-age',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MsTextFieldCustomComponent, MsCard, MsCardOutsideTitleComponent, MsHelperComponent],
  providers: [AGE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ms-age">
      <ms-card-outside-title
        *ngIf="label"
        [title]="label"
        [helperText]="hasInputError ? '' : currentHelperText"
        [hasHelper]="!hasInputError">
      </ms-card-outside-title>

      <ms-card>
        <div class="ms-age__content">
          <div class="ms-age__field-section">
            <ms-text-field-custom
              #textField
              [placeholder]="placeholder"
              [error]="hasInputError"
              [suffixText]="suffix"
              [type]="'number'"
              [formControl]="inputControl"
              (focus)="onInputFocus()"
              (blur)="onInputBlur()">
            </ms-text-field-custom>
            <ms-helper *ngIf="hasInputError" state="error">
              {{ currentHelperText }}
            </ms-helper>
          </div>

          <div class="ms-age__slider-section">
            <div class="ms-age__slider"
                 (touchstart)="onSliderTouchStart($event)"
                 (touchmove)="onSliderTouchMove($event)">
              <div class="ms-age__slider-track"></div>
              <div class="ms-age__slider-progress" [style.width.%]="progressPercentage"></div>
              <div class="ms-age__slider-handle" [style.left.%]="progressPercentage"></div>
              <input
                type="range"
                class="ms-age__slider-input"
                [min]="min"
                [max]="max"
                [step]="step"
                [formControl]="sliderControl"
                [attr.aria-label]="'Age slider'"
                (touchstart)="onSliderInputTouchStart($event)"
                (touchmove)="onSliderInputTouchMove($event)">
            </div>
          </div>
        </div>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-age.scss'],
})
export class MsAgeComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input() label: string = 'Spune-mi câți ani ai';
  @Input() placeholder: string = '30';
  @Input() suffix: string = 'ani';
  @Input() min: number = 21;
  @Input() max: number = 65;
  @Input() step: number = 1;
  @Input() disabled = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() value: number = 30; // default age value

  @Output() valueChange = new EventEmitter<number>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  @ViewChild('textField') textField?: MsTextFieldCustomComponent;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-age',
      `ms-age--surface-${this.surface}`,
      this.disabled ? 'ms-age--disabled' : '',
      this.inputControl.invalid && this.inputControl.touched ? 'ms-age--error' : '',
    ].filter(Boolean).join(' ');
  }

  inputControl = new FormControl<string>('', [Validators.required]);
  sliderControl = new FormControl<number>(30, { nonNullable: true });

  private destroy$ = new Subject<void>();
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  private isInputFocused: boolean = false;

  ngOnInit(): void {
    // Validators and initial values aligned with loan duration pattern
    this.inputControl.setValidators([
      Validators.required,
      Validators.min(this.min),
      Validators.max(this.max)
    ]);
    // Initialize with provided default value (clamped)
    const initial = Math.min(Math.max(this.value ?? 30, this.min), this.max);
    this.inputControl.setValue(String(initial), { emitEvent: false });
    this.sliderControl.setValue(initial, { emitEvent: false });
    this.syncControls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update validators if bounds changed
    if (changes['min'] || changes['max']) {
      this.inputControl.setValidators([
        Validators.required,
        Validators.min(this.min),
        Validators.max(this.max)
      ]);
    }

    // Reflect external value changes into internal controls
    if (changes['value'] && !changes['value'].firstChange) {
      const v = typeof this.value === 'number' ? this.value : 30;
      const clamped = Math.min(Math.max(v, this.min), this.max);
      this.sliderControl.setValue(clamped, { emitEvent: false });
      this.inputControl.setValue(String(clamped), { emitEvent: false });
    }

    // Sync disabled state if changed externally
    if (changes['disabled'] && !changes['disabled'].firstChange) {
      this.setDisabledState(!!this.disabled);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get hasInputError(): boolean {
    return this.inputControl.invalid && this.inputControl.touched;
  }

  get progressPercentage(): number {
    const value = this.sliderControl.value ?? this.min;
    const clamped = Math.min(Math.max(value, this.min), this.max);
    const raw = ((clamped - this.min) / (this.max - this.min)) * 100;
    const minPercentage = 2;
    const maxPercentage = 98;
    return minPercentage + (raw * (maxPercentage - minPercentage) / 100);
  }

  writeValue(value: number): void {
    const v = typeof value === 'number' ? value : 30;
    this.sliderControl.setValue(v, { emitEvent: false });
    this.inputControl.setValue(String(v), { emitEvent: false });
  }

  registerOnChange(fn: (value: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.inputControl.disable();
      this.sliderControl.disable();
    } else {
      this.inputControl.enable();
      this.sliderControl.enable();
    }
  }

  private syncControls(): void {
    this.sliderControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        const clamped = Math.min(Math.max(v ?? this.min, this.min), this.max);
        if (!this.isInputFocused) {
          this.inputControl.setValue(String(clamped), { emitEvent: false });
        }
        this.valueChange.emit(clamped);
        this.onChange(clamped);
      });

    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(val => val !== null && val !== undefined)
      )
      .subscribe(text => {
        if (this.isInputFocused) return; // Defer syncing while user is typing
        const parsed = parseInt((text || '').toString().replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed)) {
          const clamped = Math.min(Math.max(parsed, this.min), this.max);
          this.sliderControl.setValue(clamped, { emitEvent: false });
          this.valueChange.emit(clamped);
          this.onChange(clamped);
        }
      });
  }

  onInputFocus(): void { this.isInputFocused = true; this.focused.emit(new FocusEvent('focus')); }
  onInputBlur(): void {
    this.isInputFocused = false;
    const parsed = parseInt((this.inputControl.value || '').toString().replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, this.min), this.max);
      this.inputControl.setValue(String(clamped), { emitEvent: false });
      this.sliderControl.setValue(clamped, { emitEvent: false });
      this.valueChange.emit(clamped);
      this.onChange(clamped);
    }
    this.onTouched();
    this.blurred.emit(new FocusEvent('blur'));
  }

  onSliderTouchStart(event: TouchEvent): void { event.stopPropagation(); }
  onSliderTouchMove(event: TouchEvent): void { event.stopPropagation(); }
  onSliderInputTouchStart(event: TouchEvent): void { event.stopPropagation(); }
  onSliderInputTouchMove(event: TouchEvent): void { event.stopPropagation(); }

  // Helper text identical behavior to loan-duration: show friendly info
  get currentHelperText(): string {
    const textValue = this.inputControl.value || String(this.min);
    const currentValue = parseInt(textValue, 10);
    if (isNaN(currentValue)) return '';
    if (currentValue < this.min || currentValue > this.max) {
      return `Vârsta trebuie să fie între ${this.min} și ${this.max} ani`;
    }
    return `Pentru a afla durata maximă pe care o poți alege pentru creditul tău`;
  }
}



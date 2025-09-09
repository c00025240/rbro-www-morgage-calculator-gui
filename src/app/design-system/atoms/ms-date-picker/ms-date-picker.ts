import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ms-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './ms-date-picker.html',
  styleUrl: './ms-date-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MsDatePicker),
      multi: true
    }
  ]
})
export class MsDatePicker implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() prefixIcon: string = '';
  @Input() suffixIcon: string = 'calendar_today';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Input() touchUi: boolean = false;
  @Input() showTodayButton: boolean = true;
  @Input() showClearButton: boolean = true;
  @Input() dateFormat: string = 'MM/dd/yyyy';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';

  @Output() dateChange = new EventEmitter<Date | null>();
  @Output() dateInput = new EventEmitter<Date | null>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  dateControl = new FormControl<Date | null>(null);

  private onChange = (value: Date | null) => {};
  private onTouched = () => {};

  constructor() {
    this.dateControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.dateChange.emit(value);
    });
  }

  get datePickerClasses(): string {
    const classes = ['ms-date-picker'];
    classes.push(`ms-date-picker--${this.appearance}`);
    classes.push(`ms-date-picker--${this.size}`);
    
    if (this.disabled) classes.push('ms-date-picker--disabled');
    if (this.required) classes.push('ms-date-picker--required');
    if (this.readonly) classes.push('ms-date-picker--readonly');
    if (this.hasError) classes.push('ms-date-picker--error');
    
    return classes.join(' ');
  }

  get hasError(): boolean {
    return !!(this.errorMessage || this.dateControl.errors);
  }

  get displayError(): string {
    if (this.errorMessage) return this.errorMessage;
    
    const errors = this.dateControl.errors;
    if (errors) {
      if (errors['required']) return 'This field is required';
      if (errors['matDatepickerMin']) return 'Date is too early';
      if (errors['matDatepickerMax']) return 'Date is too late';
      if (errors['matDatepickerParse']) return 'Invalid date format';
    }
    
    return '';
  }

  get computedPlaceholder(): string {
    return this.placeholder || this.dateFormat.toLowerCase();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    this.dateControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.dateControl.disable();
    } else {
      this.dateControl.enable();
    }
  }

  onDateInput(event: any): void {
    const date = event.value;
    this.onTouched();
    this.dateInput.emit(date);
  }

  onDateChange(event: any): void {
    const date = event.value;
    this.onTouched();
    this.dateChange.emit(date);
  }

  onOpened(): void {
    this.opened.emit();
  }

  onClosed(): void {
    this.closed.emit();
  }

  onClear(): void {
    this.dateControl.setValue(null);
    this.onTouched();
  }

  onToday(): void {
    const today = new Date();
    this.dateControl.setValue(today);
    this.onTouched();
  }

  // Convenience methods for mortgage-specific date scenarios
  setClosingDate(): void {
    // Default to 30 days from now for closing date
    const closingDate = new Date();
    closingDate.setDate(closingDate.getDate() + 30);
    this.dateControl.setValue(closingDate);
  }

  setMoveInDate(): void {
    // Default to 45 days from now for move-in date
    const moveInDate = new Date();
    moveInDate.setDate(moveInDate.getDate() + 45);
    this.dateControl.setValue(moveInDate);
  }

  setRateExpirationDate(): void {
    // Default to 60 days from now for rate expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60);
    this.dateControl.setValue(expirationDate);
  }

  // Validation helpers
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isBusinessDay(date: Date): boolean {
    return !this.isWeekend(date);
  }

  addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (this.isBusinessDay(result)) {
        addedDays++;
      }
    }
    
    return result;
  }

  formatDateForDisplay(date: Date | null): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  }
}

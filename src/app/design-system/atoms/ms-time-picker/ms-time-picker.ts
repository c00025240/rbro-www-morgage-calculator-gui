import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
  period?: 'AM' | 'PM';
}

export interface TimeOption {
  value: TimeValue;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ms-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './ms-time-picker.html',
  styleUrl: './ms-time-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MsTimePicker),
      multi: true
    }
  ]
})
export class MsTimePicker implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() format: '12' | '24' = '12';
  @Input() showSeconds: boolean = false;
  @Input() minuteStep: number = 1;
  @Input() hourStep: number = 1;
  @Input() minTime: TimeValue | null = null;
  @Input() maxTime: TimeValue | null = null;
  @Input() prefixIcon: string = '';
  @Input() suffixIcon: string = 'access_time';
  @Input() showPresets: boolean = true;
  @Input() customPresets: TimeOption[] = [];
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';

  @Output() timeChange = new EventEmitter<TimeValue | null>();
  @Output() timeInput = new EventEmitter<TimeValue | null>();
  @Output() presetSelected = new EventEmitter<TimeOption>();

  timeControl = new FormControl<string>('');
  currentTime: TimeValue | null = null;

  private onChange = (value: TimeValue | null) => {};
  private onTouched = () => {};

  // Default presets for common times
  defaultPresets: TimeOption[] = [
    { value: { hours: 9, minutes: 0, period: 'AM' }, label: '9:00 AM' },
    { value: { hours: 12, minutes: 0, period: 'PM' }, label: '12:00 PM' },
    { value: { hours: 1, minutes: 0, period: 'PM' }, label: '1:00 PM' },
    { value: { hours: 5, minutes: 0, period: 'PM' }, label: '5:00 PM' },
    { value: { hours: 6, minutes: 0, period: 'PM' }, label: '6:00 PM' }
  ];

  // Business hours presets
  businessHoursPresets: TimeOption[] = [
    { value: { hours: 8, minutes: 0, period: 'AM' }, label: '8:00 AM - Start' },
    { value: { hours: 9, minutes: 0, period: 'AM' }, label: '9:00 AM - Standard' },
    { value: { hours: 12, minutes: 0, period: 'PM' }, label: '12:00 PM - Lunch' },
    { value: { hours: 1, minutes: 0, period: 'PM' }, label: '1:00 PM - After Lunch' },
    { value: { hours: 5, minutes: 0, period: 'PM' }, label: '5:00 PM - End' },
    { value: { hours: 6, minutes: 0, period: 'PM' }, label: '6:00 PM - Extended' }
  ];

  constructor() {
    this.timeControl.valueChanges.subscribe(value => {
      const parsedTime = this.parseTimeString(value || '');
      this.currentTime = parsedTime;
      this.onChange(parsedTime);
      this.timeChange.emit(parsedTime);
    });
  }

  get timePickerClasses(): string {
    const classes = ['ms-time-picker'];
    classes.push(`ms-time-picker--${this.appearance}`);
    classes.push(`ms-time-picker--${this.size}`);
    classes.push(`ms-time-picker--${this.format}h`);
    
    if (this.disabled) classes.push('ms-time-picker--disabled');
    if (this.required) classes.push('ms-time-picker--required');
    if (this.readonly) classes.push('ms-time-picker--readonly');
    if (this.hasError) classes.push('ms-time-picker--error');
    
    return classes.join(' ');
  }

  get hasError(): boolean {
    return !!(this.errorMessage || this.timeControl.errors);
  }

  get displayError(): string {
    if (this.errorMessage) return this.errorMessage;
    
    const errors = this.timeControl.errors;
    if (errors) {
      if (errors['required']) return 'This field is required';
      if (errors['invalidTime']) return 'Invalid time format';
      if (errors['timeOutOfRange']) return 'Time is outside allowed range';
    }
    
    return '';
  }

  get computedPlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    return this.format === '12' 
      ? (this.showSeconds ? 'hh:mm:ss AM/PM' : 'hh:mm AM/PM')
      : (this.showSeconds ? 'HH:mm:ss' : 'HH:mm');
  }

  get availablePresets(): TimeOption[] {
    return this.customPresets.length > 0 ? this.customPresets : this.defaultPresets;
  }

  // ControlValueAccessor implementation
  writeValue(value: TimeValue | null): void {
    const timeString = value ? this.formatTimeForDisplay(value) : '';
    this.timeControl.setValue(timeString, { emitEvent: false });
    this.currentTime = value;
  }

  registerOnChange(fn: (value: TimeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.timeControl.disable();
    } else {
      this.timeControl.enable();
    }
  }

  onTimeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const timeValue = this.parseTimeString(input.value);
    this.onTouched();
    this.timeInput.emit(timeValue);
  }

  onTimeChange(): void {
    this.onTouched();
  }

  onPresetClick(preset: TimeOption): void {
    if (!preset.disabled) {
      const timeString = this.formatTimeForDisplay(preset.value);
      this.timeControl.setValue(timeString);
      this.presetSelected.emit(preset);
      this.onTouched();
    }
  }

  onClear(): void {
    this.timeControl.setValue('');
    this.currentTime = null;
    this.onTouched();
  }

  onNow(): void {
    const now = new Date();
    const timeValue: TimeValue = {
      hours: this.format === '12' ? this.to12Hour(now.getHours()).hours : now.getHours(),
      minutes: now.getMinutes(),
      seconds: this.showSeconds ? now.getSeconds() : undefined,
      period: this.format === '12' ? this.to12Hour(now.getHours()).period : undefined
    };
    
    const timeString = this.formatTimeForDisplay(timeValue);
    this.timeControl.setValue(timeString);
    this.onTouched();
  }

  // Time parsing and formatting
  parseTimeString(timeStr: string): TimeValue | null {
    if (!timeStr || !timeStr.trim()) return null;

    const cleanTime = timeStr.trim().toLowerCase();
    
    // Handle 12-hour format
    if (this.format === '12') {
      const match12 = cleanTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/);
      if (match12) {
        const hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const seconds = match12[3] ? parseInt(match12[3], 10) : undefined;
        const period = (match12[4] || 'am').toUpperCase() as 'AM' | 'PM';
        
        if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
          return { hours, minutes, seconds, period };
        }
      }
    } else {
      // Handle 24-hour format
      const match24 = cleanTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      if (match24) {
        const hours = parseInt(match24[1], 10);
        const minutes = parseInt(match24[2], 10);
        const seconds = match24[3] ? parseInt(match24[3], 10) : undefined;
        
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return { hours, minutes, seconds };
        }
      }
    }
    
    return null;
  }

  formatTimeForDisplay(time: TimeValue): string {
    if (!time) return '';

    const { hours, minutes, seconds, period } = time;
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds !== undefined ? `:${seconds.toString().padStart(2, '0')}` : '';
    
    if (this.format === '12') {
      const displayHours = hours === 0 ? 12 : hours;
      const displayPeriod = period || 'AM';
      return `${displayHours}:${m}${s} ${displayPeriod}`;
    } else {
      return `${h}:${m}${s}`;
    }
  }

  formatTimeForInput(time: TimeValue): string {
    if (!time) return '';

    const { hours, minutes, seconds } = time;
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds !== undefined ? `:${seconds.toString().padStart(2, '0')}` : '';
    
    return `${h}:${m}${s}`;
  }

  // Utility methods
  to12Hour(hour24: number): { hours: number; period: 'AM' | 'PM' } {
    if (hour24 === 0) return { hours: 12, period: 'AM' };
    if (hour24 <= 12) return { hours: hour24, period: 'AM' };
    return { hours: hour24 - 12, period: 'PM' };
  }

  to24Hour(hours: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
      return hours === 12 ? 0 : hours;
    } else {
      return hours === 12 ? 12 : hours + 12;
    }
  }

  isTimeInRange(time: TimeValue): boolean {
    if (!this.minTime && !this.maxTime) return true;

    const timeMinutes = this.timeToMinutes(time);
    
    if (this.minTime) {
      const minMinutes = this.timeToMinutes(this.minTime);
      if (timeMinutes < minMinutes) return false;
    }
    
    if (this.maxTime) {
      const maxMinutes = this.timeToMinutes(this.maxTime);
      if (timeMinutes > maxMinutes) return false;
    }
    
    return true;
  }

  timeToMinutes(time: TimeValue): number {
    let hours = time.hours;
    
    if (this.format === '12' && time.period) {
      hours = this.to24Hour(time.hours, time.period);
    }
    
    return hours * 60 + time.minutes;
  }

  addMinutes(time: TimeValue, minutes: number): TimeValue {
    const totalMinutes = this.timeToMinutes(time) + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    if (this.format === '12') {
      const { hours, period } = this.to12Hour(newHours);
      return { hours, minutes: newMinutes, period };
    } else {
      return { hours: newHours, minutes: newMinutes };
    }
  }

  // Mortgage-specific convenience methods
  setBusinessHoursStart(): void {
    const time: TimeValue = { hours: 9, minutes: 0, period: 'AM' };
    const timeString = this.formatTimeForDisplay(time);
    this.timeControl.setValue(timeString);
  }

  setBusinessHoursEnd(): void {
    const time: TimeValue = { hours: 5, minutes: 0, period: 'PM' };
    const timeString = this.formatTimeForDisplay(time);
    this.timeControl.setValue(timeString);
  }

  setLunchTime(): void {
    const time: TimeValue = { hours: 12, minutes: 0, period: 'PM' };
    const timeString = this.formatTimeForDisplay(time);
    this.timeControl.setValue(timeString);
  }

  setClosingTime(): void {
    const time: TimeValue = { hours: 4, minutes: 30, period: 'PM' };
    const timeString = this.formatTimeForDisplay(time);
    this.timeControl.setValue(timeString);
  }

  setAppointmentTime(slotMinutes: number = 30): void {
    // Round current time to next appointment slot
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const nextSlot = Math.ceil(currentMinutes / slotMinutes) * slotMinutes;
    const nextHours = Math.floor(nextSlot / 60) % 24;
    const nextMins = nextSlot % 60;
    
    if (this.format === '12') {
      const { hours, period } = this.to12Hour(nextHours);
      const time: TimeValue = { hours, minutes: nextMins, period };
      const timeString = this.formatTimeForDisplay(time);
      this.timeControl.setValue(timeString);
    } else {
      const time: TimeValue = { hours: nextHours, minutes: nextMins };
      const timeString = this.formatTimeForDisplay(time);
      this.timeControl.setValue(timeString);
    }
  }

  generateTimeSlots(startTime: TimeValue, endTime: TimeValue, intervalMinutes: number = 30): TimeOption[] {
    const slots: TimeOption[] = [];
    let current = { ...startTime };
    const endMinutes = this.timeToMinutes(endTime);
    
    while (this.timeToMinutes(current) <= endMinutes) {
      slots.push({
        value: { ...current },
        label: this.formatTimeForDisplay(current)
      });
      current = this.addMinutes(current, intervalMinutes);
    }
    
    return slots;
  }

  isBusinessHours(time: TimeValue): boolean {
    const businessStart = this.timeToMinutes({ hours: 9, minutes: 0 });
    const businessEnd = this.timeToMinutes({ hours: 17, minutes: 0 });
    const timeMinutes = this.timeToMinutes(time);
    
    return timeMinutes >= businessStart && timeMinutes <= businessEnd;
  }
}

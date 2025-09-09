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
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsHelperComponent } from '../ms-helper/ms-helper';

// Value accessor provider
const CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCheckboxCustomComponent),
  multi: true,
};

@Component({
  selector: 'ms-checkbox-custom',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [CHECKBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label 
      class="ms-checkbox"
      [class.ms-checkbox--disabled]="disabled"
      [class.ms-checkbox--small]="size === 'small'"
      [class.ms-checkbox--large]="size === 'large'">
      
      <input
        #checkboxInput
        type="checkbox"
        [value]="value"
        [checked]="isChecked"
        [disabled]="disabled"
        [required]="required"
        [indeterminate]="indeterminate"
        [attr.aria-label]="ariaLabel"
        [attr.aria-describedby]="ariaDescribedby"
        (change)="onInputChange($event)"
        (focus)="onInputFocus()"
        (blur)="onInputBlur()" />
      
      <div class="checkbox__icon" aria-hidden="true">
        <!-- Checkmark Icon -->
        <div class="checkmark-icon">
          <svg width="16" height="16" viewBox="0 0 16 18" fill="none">
            <path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <!-- Indeterminate Icon -->
        <div class="indeterminate-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8C3 7.44772 3.44772 7 4 7H12C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9H4C3.44772 9 3 8.55228 3 8Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <span class="checkbox__label" *ngIf="label">
        {{ label }}
      </span>
      <span class="checkbox__label" *ngIf="!label">
        <ng-content></ng-content>
      </span>
    </label>
    
    <!-- Helper Text (Optional) -->
    <ms-helper 
      *ngIf="helperText"
      [surface]="surface"
      [state]="error ? 'error' : 'regular'"
      class="ms-checkbox__helper">
      {{ helperText }}
    </ms-helper>
  `,
  styleUrls: ['./ms-checkbox-custom.scss'],
})
export class MsCheckboxCustomComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = '';
  @Input() value: any = null;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled = false;
  @Input() error = false;
  @Input() required = false;
  @Input() indeterminate = false;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;
  @Input() helperText?: string;
  
  @Output() valueChange = new EventEmitter<boolean>();

  @ViewChild('checkboxInput', { static: true }) checkboxInput!: ElementRef<HTMLInputElement>;

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-checkbox-custom',
      `ms-checkbox-custom--${this.size}`,
      `ms-checkbox-custom--surface-${this.surface}`,
      this.disabled ? 'ms-checkbox-custom--disabled' : '',
      this.error ? 'ms-checkbox-custom--error' : '',
      this.helperText ? 'ms-checkbox-custom--has-helper' : '',
    ].filter(Boolean).join(' ');
  }

  private _checked = false;
  private _touched = false;
  private _onChange = (value: boolean) => {};
  private _onTouched = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Update indeterminate state on the native input
    this.updateIndeterminateState();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  get isChecked(): boolean {
    return this._checked;
  }



  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this._checked = !!value;
    this.updateIndeterminateState();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Event handlers
  onInputChange(event: Event): void {
    if (this.disabled) return;
    
    const target = event.target as HTMLInputElement;
    this._checked = target.checked;
    
    // Clear indeterminate state when user clicks
    if (this.indeterminate) {
      this.indeterminate = false;
      this.updateIndeterminateState();
    }
    
    this._onChange(this._checked);
    this.valueChange.emit(this._checked);
    this.cdr.markForCheck();
  }

  onInputFocus(): void {
    if (!this._touched) {
      this._touched = true;
      this._onTouched();
    }
  }

  onInputBlur(): void {
    // Additional blur handling if needed
  }

  // Public method to toggle programmatically
  toggle(): void {
    if (this.disabled) return;
    
    this._checked = !this._checked;
    
    // Clear indeterminate state when toggled programmatically
    if (this.indeterminate) {
      this.indeterminate = false;
      this.updateIndeterminateState();
    }
    
    this._onChange(this._checked);
    this.valueChange.emit(this._checked);
    this.cdr.markForCheck();
  }

  private updateIndeterminateState(): void {
    if (this.checkboxInput?.nativeElement) {
      this.checkboxInput.nativeElement.indeterminate = this.indeterminate;
    }
  }
} 
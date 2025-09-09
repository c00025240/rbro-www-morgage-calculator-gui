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
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsHelperComponent } from '../ms-helper/ms-helper';

export interface RadioOption {
  value: any;
  label: string;
  disabled?: boolean;
}

// Value accessor provider
const RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsRadioCustomComponent),
  multi: true,
};

// Unique name generator
let nextUniqueId = 0;
function uniqueName(): string {
  return `ms-radio-group-${++nextUniqueId}`;
}

@Component({
  selector: 'ms-radio-custom',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  providers: [RADIO_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="ms-radio-group"
      [class.ms-radio-group--disabled]="disabled"
      [class.ms-radio-group--error]="error"
      [class.ms-radio-group--has-helper]="helperText"
      role="radiogroup"
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledby"
      [attr.aria-describedby]="ariaDescribedby">
      
      <label 
        *ngFor="let option of options; trackBy: trackByValue; let i = index"
        class="ms-radio"
        [class.ms-radio--disabled]="option.disabled || disabled"
        [class.ms-radio--small]="size === 'small'"
        [class.ms-radio--large]="size === 'large'"
        (click)="onOptionClick(option, $event)"
        (keydown)="onKeyDown($event, i)">
        
        <input
          type="radio"
          [name]="name"
          [value]="option.value"
          [checked]="isSelected(option.value)"
          [disabled]="option.disabled || disabled"
          [required]="required"
          [attr.aria-describedby]="ariaDescribedby"
          (change)="onInputChange(option.value)"
          (focus)="onInputFocus($event)"
          (blur)="onInputBlur($event)" />
        
        <div class="radio__icon" aria-hidden="true"></div>
        
        <span class="radio__label">
          {{ option.label }}
        </span>
      </label>
      
      <!-- Helper Text (Optional) -->
      <ms-helper 
        *ngIf="helperText"
        [surface]="surface"
        [state]="error ? 'error' : 'regular'"
        class="ms-radio-group__helper">
        {{ helperText }}
      </ms-helper>
    </div>
  `,
  styleUrls: ['./ms-radio-custom.scss'],
})
export class MsRadioCustomComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() name = uniqueName();
  @Input() options: RadioOption[] = [];
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled = false;
  @Input() error = false;
  @Input() required = false;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledby?: string;
  @Input() ariaDescribedby?: string;
  @Input() helperText?: string;
  
  @Output() valueChange = new EventEmitter<any>();

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-radio-custom',
      `ms-radio-custom--${this.size}`,
      `ms-radio-custom--surface-${this.surface}`,
      this.disabled ? 'ms-radio-custom--disabled' : '',
      this.error ? 'ms-radio-custom--error' : '',
    ].filter(Boolean).join(' ');
  }

  private _value: any = null;
  private _touched = false;
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.options || this.options.length === 0) {
      console.warn('MsRadioCustomComponent: No options provided');
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Public methods
  trackByValue(index: number, option: RadioOption): any {
    return option.value;
  }

  isSelected(value: any): boolean {
    return this._value === value;
  }

  onOptionClick(option: RadioOption, event: Event): void {
    if (option.disabled || this.disabled) {
      event.preventDefault();
      return;
    }
    
    // For single radio button, implement toggle behavior (checkbox-like)
    if (this.options.length === 1) {
      if (this._value === option.value) {
        // If it's a single radio and already selected, deselect it
        this.selectOption(null);
      } else {
        // If it's a single radio and not selected, select it
        this.selectOption(option.value);
      }
    } else {
      // For multiple radio buttons, standard radio behavior
      this.selectOption(option.value);
    }
  }

  onInputChange(value: any): void {
    // For input change events, always select the value (no toggle logic here)
    // This prevents conflicts with click events and ensures proper form behavior
    this.selectOption(value);
  }

  onInputFocus(event: FocusEvent): void {
    // Mark as touched when first focused
    if (!this._touched) {
      this._touched = true;
      this._onTouched();
    }
  }

  onInputBlur(event: FocusEvent): void {
    // Additional blur handling if needed
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    if (this.disabled) return;

    let targetIndex = -1;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        targetIndex = this.getNextEnabledIndex(currentIndex);
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        targetIndex = this.getPreviousEnabledIndex(currentIndex);
        break;
        
      case ' ':
      case 'Enter':
        event.preventDefault();
        const option = this.options[currentIndex];
        if (option && !option.disabled) {
          // For single radio button, implement toggle behavior (checkbox-like)
          if (this.options.length === 1) {
            if (this._value === option.value) {
              // If it's a single radio and already selected, deselect it
              this.selectOption(null);
            } else {
              // If it's a single radio and not selected, select it
              this.selectOption(option.value);
            }
          } else {
            // For multiple radio buttons, standard radio behavior
            this.selectOption(option.value);
          }
        }
        break;
        
      default:
        return;
    }

    if (targetIndex >= 0 && targetIndex < this.options.length) {
      const targetOption = this.options[targetIndex];
      if (targetOption && !targetOption.disabled) {
        this.selectOption(targetOption.value);
        // Focus the target input
        setTimeout(() => {
          const inputs = document.querySelectorAll(`input[name="${this.name}"]`);
          const targetInput = inputs[targetIndex] as HTMLInputElement;
          if (targetInput) {
            targetInput.focus();
          }
        });
      }
    }
  }

  private selectOption(value: any): void {
    if (this.disabled) return;
    
    this._value = value;
    this._onChange(value);
    this.valueChange.emit(value);
    this.cdr.markForCheck();
  }

  private getNextEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex + 1; i < this.options.length; i++) {
      if (!this.options[i].disabled) {
        return i;
      }
    }
    // Wrap around to beginning
    for (let i = 0; i <= currentIndex; i++) {
      if (!this.options[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private getPreviousEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.options[i].disabled) {
        return i;
      }
    }
    // Wrap around to end
    for (let i = this.options.length - 1; i >= currentIndex; i--) {
      if (!this.options[i].disabled) {
        return i;
      }
    }
    return -1;
  }
} 
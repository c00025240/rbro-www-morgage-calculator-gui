import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ms-progress-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './ms-progress-spinner.html',
  styleUrl: './ms-progress-spinner.scss'
})
export class MsProgressSpinner {
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() value: number = 0;
  @Input() diameter: number = 40;
  @Input() strokeWidth: number = 4;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' | 'custom' = 'medium';
  @Input() label: string = '';
  @Input() showValue: boolean = false;
  @Input() centered: boolean = false;
  @Input() inline: boolean = false;
  @Input() overlay: boolean = false;
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';

  get computedDiameter(): number {
    if (this.size === 'custom') return this.diameter;
    
    switch (this.size) {
      case 'small': return 24;
      case 'medium': return 40;
      case 'large': return 64;
      default: return 40;
    }
  }

  get computedStrokeWidth(): number {
    if (this.size === 'custom') return this.strokeWidth;
    
    switch (this.size) {
      case 'small': return 3;
      case 'medium': return 4;
      case 'large': return 6;
      default: return 4;
    }
  }

  get normalizedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }

  get displayValue(): string {
    return `${Math.round(this.normalizedValue)}%`;
  }

  get wrapperClasses(): string {
    const classes = ['ms-progress-spinner'];
    
    classes.push(`ms-progress-spinner--${this.size}`);
    classes.push(`ms-progress-spinner--${this.color}`);
    
    if (this.centered) classes.push('ms-progress-spinner--centered');
    if (this.inline) classes.push('ms-progress-spinner--inline');
    if (this.overlay) classes.push('ms-progress-spinner--overlay');
    if (this.disabled) classes.push('ms-progress-spinner--disabled');
    
    return classes.join(' ');
  }
}

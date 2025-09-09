import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ms-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './ms-progress-bar.html',
  styleUrl: './ms-progress-bar.scss'
})
export class MsProgressBar {
  @Input() mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate';
  @Input() value: number = 0;
  @Input() bufferValue: number = 0;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() label: string = '';
  @Input() showValue: boolean = false;
  @Input() valueFormat: 'percentage' | 'fraction' | 'custom' = 'percentage';
  @Input() maxValue: number = 100;
  @Input() minValue: number = 0;
  @Input() disabled: boolean = false;
  @Input() striped: boolean = false;
  @Input() animated: boolean = false;
  @Input() ariaLabel: string = '';

  get normalizedValue(): number {
    if (this.mode !== 'determinate') return 0;
    return Math.max(this.minValue, Math.min(this.maxValue, this.value));
  }

  get normalizedBufferValue(): number {
    if (this.mode !== 'buffer') return 0;
    return Math.max(this.minValue, Math.min(this.maxValue, this.bufferValue));
  }

  get displayValue(): string {
    const val = this.normalizedValue;
    const max = this.maxValue;
    
    switch (this.valueFormat) {
      case 'percentage':
        return `${Math.round((val / max) * 100)}%`;
      case 'fraction':
        return `${val} / ${max}`;
      case 'custom':
        return val.toString();
      default:
        return `${Math.round((val / max) * 100)}%`;
    }
  }

  get progressPercentage(): number {
    if (this.mode !== 'determinate') return 0;
    return (this.normalizedValue / this.maxValue) * 100;
  }

  get bufferPercentage(): number {
    if (this.mode !== 'buffer') return 0;
    return (this.normalizedBufferValue / this.maxValue) * 100;
  }

  get isComplete(): boolean {
    return this.mode === 'determinate' && this.normalizedValue >= this.maxValue;
  }
}

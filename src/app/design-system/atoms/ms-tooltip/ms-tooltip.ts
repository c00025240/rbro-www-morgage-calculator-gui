import { Component, Input } from '@angular/core';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ms-tooltip',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './ms-tooltip.html',
  styleUrl: './ms-tooltip.scss'
})
export class MsTooltip {
  @Input() tooltip: string = '';
  @Input() position: TooltipPosition = 'above';
  @Input() showDelay: number = 500;
  @Input() hideDelay: number = 0;
  @Input() touchGestures: 'auto' | 'on' | 'off' = 'auto';
  @Input() disabled: boolean = false;
  @Input() tooltipClass: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() theme: 'default' | 'dark' | 'light' | 'info' | 'warning' | 'error' | 'success' = 'default';
  @Input() maxWidth: string = '250px';
  @Input() multiline: boolean = false;
  @Input() persistent: boolean = false;
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';

  get computedTooltipClass(): string {
    const classes = ['ms-tooltip'];
    
    classes.push(`ms-tooltip--${this.size}`);
    classes.push(`ms-tooltip--${this.theme}`);
    
    if (this.multiline) classes.push('ms-tooltip--multiline');
    if (this.persistent) classes.push('ms-tooltip--persistent');
    if (this.tooltipClass) classes.push(this.tooltipClass);
    
    return classes.join(' ');
  }

  get computedMaxWidth(): string {
    switch (this.size) {
      case 'small': return '200px';
      case 'medium': return '250px';
      case 'large': return '350px';
      default: return this.maxWidth;
    }
  }
}

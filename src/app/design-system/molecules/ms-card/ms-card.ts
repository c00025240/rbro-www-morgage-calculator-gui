import { Component, Input, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardSurface = 'light' | 'dark';

@Component({
  selector: 'ms-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-card.html',
  styleUrls: ['./ms-card.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsCard {
  @Input() surface: CardSurface = 'light';
  @Input() maxWidth: boolean = true; // Whether to apply max-width on large screens
  @Input() noPadding: boolean = false; // Option to remove padding for custom layouts
  @Input() allowOverflow: boolean = false; // Allow child overlays (e.g., dropdowns) to render outside card

  containerClasses = computed(() => {
    const classes = [
      'ms-card',
      `ms-card--surface-${this.surface}`,
      this.maxWidth ? 'ms-card--max-width' : '',
      this.noPadding ? 'ms-card--no-padding' : '',
      this.allowOverflow ? 'ms-card--allow-overflow' : ''
    ];
    return classes.filter(Boolean);
  });
} 
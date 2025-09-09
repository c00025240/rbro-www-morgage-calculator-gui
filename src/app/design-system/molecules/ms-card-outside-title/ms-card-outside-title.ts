import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsHelperComponent } from '../../atoms/ms-helper/ms-helper';

export type CardOutsideTitleSurface = 'default' | 'light' | 'dark';

@Component({
  selector: 'ms-card-outside-title',
  standalone: true,
  imports: [CommonModule, MsHelperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ms-card-outside-title.html',
  styleUrls: ['./ms-card-outside-title.scss']
})
export class MsCardOutsideTitleComponent {
  @Input() title: string = '';
  @Input() helperText: string = '';
  @Input() hasHelper: boolean = false;
  @Input() surface: CardOutsideTitleSurface = 'default';

  get titleClasses(): string[] {
    const classes = [
      'ms-card-outside-title__title',
      `ms-card-outside-title__title--surface-${this.surface}`
    ];
    return classes;
  }

  get containerClasses(): string[] {
    const classes = [
      'ms-card-outside-title',
      `ms-card-outside-title--surface-${this.surface}`
    ];
    
    if (this.hasHelper) {
      classes.push('ms-card-outside-title--with-helper');
    }
    
    return classes;
  }
} 
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type HelperState = 'regular' | 'error';

@Component({
  selector: 'ms-helper',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="ms-helper"
      [class.ms-helper--error]="state === 'error'">
      
      <div class="ms-helper__icon">
        <!-- Single responsive icon that scales from 12px to 16px -->
        <svg 
          class="ms-helper__icon-svg"
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true">
          <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM10 11V13H11V15H9.5V17H14.5V15H13V12C13 11.4477 12.5523 11 12 11H10ZM12 7C11.1716 7 10.5 7.67157 10.5 8.5C10.5 9.32843 11.1716 10 12 10C12.8284 10 13.5 9.32843 13.5 8.5C13.5 7.67157 12.8284 7 12 7Z"/>
        </svg>
      </div>
      
      <span class="ms-helper__text">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styleUrls: ['./ms-helper.scss'],
})
export class MsHelperComponent {
  @Input() state: HelperState = 'regular';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @HostBinding('class') get hostClasses(): string {
    return [
      'ms-helper-wrapper',
      `ms-helper-wrapper--${this.surface}`,
      `ms-helper-wrapper--${this.state}`,
    ].join(' ');
  }
} 
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCellLabel } from '../../atoms/ms-cell-label/ms-cell-label';
import { MsSwitchCell } from '../ms-switch-cell/ms-switch-cell';

@Component({
  selector: 'ms-switch-form',
  standalone: true,
  imports: [CommonModule, MsCellLabel, MsSwitchCell],
  templateUrl: './ms-switch-form.html',
  styleUrls: ['./ms-switch-form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsSwitchForm {
  // Cell Label properties
  @Input() labelText: string = '';
  @Input() labelMaxLength: number = 50;
  @Input() rightText?: string;
  @Input() rightTextDisabled: boolean = false;

  // Switch Cell properties
  @Input() switchLabel: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() showInfoIcon: boolean = false;
  @Input() infoTooltip: string = '';

  // Events
  @Output() change = new EventEmitter<{ checked: boolean }>();
  @Output() infoClick = new EventEmitter<void>();

  onSwitchChange(event: { checked: boolean }): void {
    this.change.emit(event);
  }

  onInfoIconClick(): void {
    this.infoClick.emit();
  }

  getSwitchFormClasses(): string[] {
    const classes = [
      'ms-switch-form',
      `ms-switch-form--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-switch-form--disabled');
    }

    return classes;
  }
} 
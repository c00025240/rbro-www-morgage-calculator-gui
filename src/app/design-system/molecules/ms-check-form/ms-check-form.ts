import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCellLabel } from '../../atoms/ms-cell-label/ms-cell-label';
import { MsCheckCell } from '../ms-check-cell/ms-check-cell';
import { ChipItem } from '../../atoms/ms-chips/ms-chips';

@Component({
  selector: 'ms-check-form',
  standalone: true,
  imports: [CommonModule, MsCellLabel, MsCheckCell],
  templateUrl: './ms-check-form.html',
  styleUrls: ['./ms-check-form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsCheckForm {
  // Cell Label properties
  @Input() labelText: string = '';
  @Input() labelMaxLength: number = 50;

  // Check Cell properties
  @Input() checkboxLabel: string = '';
  @Input() checkboxValue: boolean = false;
  @Input() checkboxSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() checkboxDisabled: boolean = false;
  @Input() checkboxRequired: boolean = false;
  @Input() checkboxIndeterminate: boolean = false;

  // Chip properties - Single chip
  @Input() chipType: 'primary' | 'secondary' | 'tertiary' | 'savings' = 'primary';
  @Input() chipData: ChipItem | string = '';
  @Input() chipSavingsSize: 's' | 'm' | 'l' = 'm';

  // Form properties
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  // Events
  @Output() checkboxChange = new EventEmitter<boolean>();
  @Output() chipClicked = new EventEmitter<ChipItem>();
  @Output() chipSelected = new EventEmitter<{ chip: ChipItem; selected: boolean }>();

  onCheckboxChange(value: boolean): void {
    this.checkboxChange.emit(value);
  }

  onChipClicked(chip: ChipItem): void {
    this.chipClicked.emit(chip);
  }

  onChipSelected(event: { chip: ChipItem; selected: boolean }): void {
    this.chipSelected.emit(event);
  }

  getCheckFormClasses(): string[] {
    const classes = [
      'ms-check-form',
      `ms-check-form--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-check-form--disabled');
    }

    return classes;
  }
} 
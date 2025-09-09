import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCellLabel } from '../../atoms/ms-cell-label/ms-cell-label';
import { MsRadioCell } from '../ms-radio-cell/ms-radio-cell';
import { RadioOption } from '../../atoms/ms-radio-custom/ms-radio-custom';
import { ChipItem } from '../../atoms/ms-chips/ms-chips';

@Component({
  selector: 'ms-radio-form',
  standalone: true,
  imports: [CommonModule, MsCellLabel, MsRadioCell],
  templateUrl: './ms-radio-form.html',
  styleUrls: ['./ms-radio-form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsRadioForm {
  // Cell Label properties
  @Input() labelText: string = '';
  @Input() labelMaxLength: number = 50;

  // Radio Cell properties - Single radio button
  @Input() radioOption: RadioOption | null = null;
  @Input() radioValue: any = null;
  @Input() radioName: string = '';
  @Input() radioSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() radioDisabled: boolean = false;
  @Input() radioRequired: boolean = false;

  // Chip properties - Single chip
  @Input() chipType: 'primary' | 'secondary' | 'tertiary' | 'savings' = 'primary';
  @Input() chipData: ChipItem | string = '';
  @Input() chipSavingsSize: 's' | 'm' | 'l' = 'm';

  // Form properties
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  // Events
  @Output() radioChange = new EventEmitter<any>();
  @Output() chipClicked = new EventEmitter<ChipItem>();
  @Output() chipSelected = new EventEmitter<{ chip: ChipItem; selected: boolean }>();

  onRadioChange(value: any): void {
    this.radioChange.emit(value);
  }

  onChipClicked(chip: ChipItem): void {
    this.chipClicked.emit(chip);
  }

  onChipSelected(event: { chip: ChipItem; selected: boolean }): void {
    this.chipSelected.emit(event);
  }

  getRadioFormClasses(): string[] {
    const classes = [
      'ms-radio-form',
      `ms-radio-form--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-radio-form--disabled');
    }

    return classes;
  }
} 
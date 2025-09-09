import { Component, Input, Output, EventEmitter, ViewEncapsulation, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsRadioCustomComponent, RadioOption } from '../../atoms/ms-radio-custom/ms-radio-custom';
import { MsChips, ChipItem } from '../../atoms/ms-chips/ms-chips';
import { MsSavingsChip } from '../../organisms/ms-savings-chip/ms-savings-chip';

@Component({
  selector: 'ms-radio-cell',
  standalone: true,
  imports: [CommonModule, FormsModule, MsRadioCustomComponent, MsChips, MsSavingsChip],
  templateUrl: './ms-radio-cell.html',
  styleUrls: ['./ms-radio-cell.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsRadioCell implements OnInit {
  // Radio properties - Single radio button
  @Input() radioOption: RadioOption | null = null; // Single radio option
  @Input() radioValue: any = null;
  @Input() radioName: string = '';
  @Input() radioSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() radioDisabled: boolean = false;
  @Input() radioRequired: boolean = false;

  // Chip properties - Single chip
  @Input() chipType: 'primary' | 'secondary' | 'tertiary' | 'savings' = 'primary';
  @Input() chipData: ChipItem | string = ''; // Single chip or savings chip text
  @Input() chipSavingsSize: 's' | 'm' | 'l' = 'm'; // For savings chip only

  // Cell properties
  @Input() disabled: boolean = false;

  // Events
  @Output() radioChange = new EventEmitter<any>();
  @Output() chipClicked = new EventEmitter<ChipItem>();
  @Output() chipSelected = new EventEmitter<{ chip: ChipItem; selected: boolean }>();

  private isHovered = signal<boolean>(false);

  ngOnInit(): void {}

  onRadioChange(value: any): void {
    this.radioValue = value;
    this.radioChange.emit(value);
  }

  onChipClicked(chip: ChipItem): void {}

  onChipSelected(event: { chip: ChipItem; selected: boolean }): void {}

  onMouseEnter(): void { this.isHovered.set(true); }
  onMouseLeave(): void { this.isHovered.set(false); }

  getRadioCellClasses(): string[] {
    const classes = [
      'ms-radio-cell'
    ];

    if (this.disabled) {
      classes.push('ms-radio-cell--disabled');
    }

    if (this.isHovered()) {
      classes.push('ms-radio-cell--hovered');
    }

    return classes;
  }

  // Helper methods for template
  get singleChip(): ChipItem | null {
    if (typeof this.chipData === 'object' && this.chipData !== null) {
      const chip = { ...this.chipData } as ChipItem;
      delete chip.iconLeft;
      delete chip.iconRight;
      return chip;
    }
    return null;
  }

  get savingsChipText(): string {
    return typeof this.chipData === 'string' ? this.chipData : '';
  }

  get isSavingsChip(): boolean { return this.chipType === 'savings'; }

  get radioOptions(): RadioOption[] { return this.radioOption ? [this.radioOption] : []; }
} 
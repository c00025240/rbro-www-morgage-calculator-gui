import { Component, Input, Output, EventEmitter, ViewEncapsulation, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsCheckboxCustomComponent } from '../../atoms/ms-checkbox-custom/ms-checkbox-custom';
import { MsChips, ChipItem } from '../../atoms/ms-chips/ms-chips';
import { MsSavingsChip } from '../../organisms/ms-savings-chip/ms-savings-chip';

@Component({
  selector: 'ms-check-cell',
  standalone: true,
  imports: [CommonModule, FormsModule, MsCheckboxCustomComponent, MsChips, MsSavingsChip],
  templateUrl: './ms-check-cell.html',
  styleUrls: ['./ms-check-cell.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsCheckCell implements OnInit {
  // Checkbox properties
  @Input() checkboxLabel: string = '';
  @Input() checkboxValue: boolean = false;
  @Input() checkboxSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() checkboxDisabled: boolean = false;
  @Input() checkboxRequired: boolean = false;
  @Input() checkboxIndeterminate: boolean = false;

  // Chip properties - Single chip
  @Input() chipType: 'primary' | 'secondary' | 'tertiary' | 'savings' = 'primary';
  @Input() chipData: ChipItem | string = ''; // Single chip or savings chip text
  @Input() chipSavingsSize: 's' | 'm' | 'l' = 'm'; // For savings chip only

  // Cell properties
  @Input() disabled: boolean = false;

  // Events
  @Output() checkboxChange = new EventEmitter<boolean>();
  @Output() chipClicked = new EventEmitter<ChipItem>();
  @Output() chipSelected = new EventEmitter<{ chip: ChipItem; selected: boolean }>();

  private isHovered = signal<boolean>(false);

  ngOnInit(): void {}

  onCheckboxChange(value: boolean): void {
    this.checkboxValue = value;
    this.checkboxChange.emit(value);
  }

  onChipClicked(chip: ChipItem): void {}

  onChipSelected(event: { chip: ChipItem; selected: boolean }): void {}

  onMouseEnter(): void { this.isHovered.set(true); }
  onMouseLeave(): void { this.isHovered.set(false); }

  getCheckCellClasses(): string[] {
    const classes = [
      'ms-check-cell'
    ];

    if (this.disabled) {
      classes.push('ms-check-cell--disabled');
    }

    if (this.isHovered()) {
      classes.push('ms-check-cell--hovered');
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
} 
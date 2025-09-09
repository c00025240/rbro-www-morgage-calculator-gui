import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsSavingsChip } from '../../organisms/ms-savings-chip/ms-savings-chip';

@Component({
  selector: 'ms-cell-label',
  standalone: true,
  imports: [CommonModule, MsSavingsChip],
  templateUrl: './ms-cell-label.html',
  styleUrls: ['./ms-cell-label.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsCellLabel {
  @Input() text: string = '';
  @Input() maxLength: number = 50;
  @Input() rightText?: string;
  @Input() rightTextDisabled: boolean = false;

  get displayText(): string {
    if (!this.text) return '';
    if (this.text.length <= this.maxLength) {
      return this.text;
    }
    return this.text.substring(0, this.maxLength).trim() + '...';
  }

  get isTextTruncated(): boolean {
    return this.text.length > this.maxLength;
  }

  getCellLabelClasses(): string[] {
    const classes = ['ms-cell-label'];
    if (this.isTextTruncated) {
      classes.push('ms-cell-label--truncated');
    }
    return classes;
  }
} 
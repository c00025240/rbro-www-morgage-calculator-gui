import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsChips, ChipItem } from '../../atoms/ms-chips/ms-chips';
import { MsButtonLink } from '../../atoms/ms-button-link/ms-button-link';

@Component({
  selector: 'ms-simulator-swap-hero',
  standalone: true,
  imports: [CommonModule, MsChips, MsButtonLink],
  templateUrl: './ms-simulator-swap-hero.html',
  styleUrls: ['./ms-simulator-swap-hero.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsSimulatorSwapHero implements OnInit, OnChanges {
  @Input() variant: 'basic' | 'epic' = 'basic';
  @Input() label: string = 'Label';
  @Input() chipLabel: string = 'chip_tertiary';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() hasClose: boolean = false;
  @Input() disabled: boolean = false;

  @Output() chipClicked = new EventEmitter<void>();
  @Output() closeClicked = new EventEmitter<void>();

  // Pre-computed values to avoid getter hell
  chipItems: ChipItem[] = [];
  containerClass: string = '';

  ngOnInit(): void {
    this.updateChipItems();
    this.updateContainerClass();
  }

  ngOnChanges(): void {
    this.updateChipItems();
    this.updateContainerClass();
  }

  private updateChipItems(): void {
    this.chipItems = [{
      id: 'simulator-chip',
      label: this.chipLabel,
      iconRight: 'select-open-down',
      disabled: this.disabled
    }];
  }

  private updateContainerClass(): void {
    const classes = [
      'ms-simulator-swap-hero',
      `ms-simulator-swap-hero--variant-${this.variant}`,
      `ms-simulator-swap-hero--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-simulator-swap-hero--disabled');
    }

    this.containerClass = classes.join(' ');
  }

  onChipClick(chip?: ChipItem): void {
    console.log('🔘 Chip clicked in ms-simulator-swap-hero:', chip);
    if (!this.disabled) {
      this.chipClicked.emit();
    }
  }

  onCloseClick(event: Event): void {
    if (!this.disabled) {
      this.closeClicked.emit();
    }
  }
} 
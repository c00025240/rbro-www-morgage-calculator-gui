import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsAmountCombo, AmountData } from '../../molecules/ms-amount-combo/ms-amount-combo';
import { MsButtonSecondary } from '../../atoms/ms-button-secondary/ms-button-secondary';
import { MsButtonPrimary } from '../../atoms/ms-button-primary/ms-button-primary';
import { MsInfoContainedCell } from '../../molecules/ms-info-contained-cell/ms-info-contained-cell';

@Component({
  selector: 'ms-web-summary-card',
  standalone: true,
  imports: [CommonModule, MsCard, MsAmountCombo, MsButtonSecondary, MsButtonPrimary, MsInfoContainedCell],
  templateUrl: './ms-web-summary-card.html',
  styleUrls: ['./ms-web-summary-card.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsWebSummaryCard {
  @Input() title: string = '';
  @Input() leftTopAmount!: AmountData;
  @Input() rightTopAmount!: AmountData;
  @Input() leftBottomAmount?: AmountData;
  @Input() rightBottomAmount?: AmountData;
  // New: optional multi-column API to render multiple offers in one card
  @Input() columns?: Array<{
    leftTop: AmountData;
    rightTop: AmountData;
    leftBottom?: AmountData;
    rightBottom?: AmountData;
    title?: string;
    extraDetails?: Array<{ label: string; value: string }>;
  }>;
  @Input() primaryButtonLabel: string = '';
  @Input() secondaryButtonLabel: string = '';
  @Input() helperText?: string;

  // New: texts for the two info cells shown under the amount combos
  @Input() topInfoText: string = '';
  @Input() bottomInfoText: string = '';

  // New: footnote text under the buttons
  @Input() footnoteText: string = 'Apasand butonul “Aplica” vei fi redirectionat catre un formular de contact. Vei fi sunat in maxim 1 zi lucratoare pentru a primi raspunsuri la orice intrebare ai.';

  // Error banner control from parent
  @Input() showErrorBanner: boolean = false;
  @Input() errorText: string = '';

  @Output() primaryClicked = new EventEmitter<void>();
  @Output() secondaryClicked = new EventEmitter<void>();

  // Optional expandable details area (legacy single-mode)
  @Input() extraDetails?: Array<{ label: string; value: string }>;
  isExpanded = false;
  toggleDetails(): void { this.isExpanded = !this.isExpanded; }

  // Per-column expand state for multi-column mode
  isExpandedAll = false;
  isExpandedIndex(index: number): boolean { return this.isExpandedAll; }
  toggleDetailsIndex(index: number): void { this.isExpandedAll = !this.isExpandedAll; }

  onPrimaryClick(): void { this.primaryClicked.emit(); }
  onSecondaryClick(): void { this.secondaryClicked.emit(); }
} 
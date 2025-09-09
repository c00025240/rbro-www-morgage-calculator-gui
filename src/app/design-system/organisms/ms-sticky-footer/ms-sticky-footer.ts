import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MsAmountCombo, AmountData } from '../../molecules/ms-amount-combo/ms-amount-combo';
import { MsButtonSecondary } from '../../atoms/ms-button-secondary/ms-button-secondary';
import { MsButtonPrimary } from '../../atoms/ms-button-primary/ms-button-primary';

export type StickyFooterSurface = 'default' | 'light' | 'dark';

export interface StickyFooterActions {
	details?: {
		label: string;
		disabled?: boolean;
	};
	primary?: {
		label: string;
		disabled?: boolean;
		iconRight?: string;
	};
	share?: {
		disabled?: boolean;
		ariaLabel?: string;
		title?: string;
	};
}

@Component({
	selector: 'ms-sticky-footer',
	standalone: true,
	imports: [CommonModule, MsAmountCombo, MsButtonSecondary, MsButtonPrimary],
	templateUrl: './ms-sticky-footer.html',
	styleUrls: ['./ms-sticky-footer.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsStickyFooter {
	/** Left amount data for the summary */
	@Input() leftAmount?: AmountData;
	
	/** Right amount data for the summary */
	@Input() rightAmount?: AmountData;
	
	/** Action button configurations */
	@Input() actions?: StickyFooterActions;
	
	/** Surface theme for color adaptation */
	@Input() surface: StickyFooterSurface = 'default';
	
	/** Additional CSS class for custom styling */
	@Input() cssClass?: string;

	/** Emitted when details button is clicked */
	@Output() detailsClicked = new EventEmitter<MouseEvent>();
	
	/** Emitted when primary action button is clicked */
	@Output() primaryClicked = new EventEmitter<MouseEvent>();
	
	/** Emitted when share button is clicked */
	@Output() shareClicked = new EventEmitter<MouseEvent>();

	/**
	 * Handles details button click events
	 */
	onDetailsClick(event: MouseEvent): void {
		this.detailsClicked.emit(event);
	}

	/**
	 * Handles primary action button click events
	 */
	onPrimaryClick(event: MouseEvent): void {
		this.primaryClicked.emit(event);
	}

	/**
	 * Handles share button click events
	 */
	onShareClick(event: MouseEvent): void {
		this.shareClicked.emit(event);
	}
} 
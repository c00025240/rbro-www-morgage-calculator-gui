import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsButtonSecondary } from '../../atoms/ms-button-secondary/ms-button-secondary';

/**
 * Interface defining the structure for header action buttons
 */
export interface HeaderAction {
	/** Button label text */
	label: string;
	/** Optional left icon name (SVG file name) */
	iconLeft?: string;
	/** Optional right icon name (SVG file name) */
	iconRight?: string;
	/** Whether the button is disabled */
	disabled?: boolean;
	/** Accessibility label for screen readers */
	ariaLabel?: string;
	/** Tooltip text shown on hover */
	title?: string;
}

/**
 * Header Component - Organism Level
 * 
 * A responsive header component for page-level navigation with back button and action buttons.
 * Implements design specifications with proper elevation, responsive behavior, and dark mode support.
 * 
 * @example
 * ```html
 * <ms-header
 *   title="Simulator credit ipotecar"
 *   [primaryAction]="{ label: 'Vreau să fiu sunat' }"
 *   [secondaryAction]="{ label: 'RO' }"
 *   (backClicked)="onBack($event)">
 * </ms-header>
 * ```
 * 
 * @features
 * - Desktop: 120px height, elevation 3, max-width 1440px
 * - Mobile: 48px height, no elevation, 12px padding
 * - Dark mode support with surface variants
 * - Responsive action buttons (different layouts for desktop/mobile)
 * - Full accessibility support with ARIA labels
 * - Sticky positioning with proper z-index
 */
@Component({
	selector: 'ms-header',
	standalone: true,
	imports: [CommonModule, MsButtonSecondary],
	templateUrl: './ms-header.html',
	styleUrls: ['./ms-header.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsHeader {
	/** Main heading text (H2 on desktop, hidden on mobile) */
	@Input() title: string = '';
	
	/** Label for the back button */
	@Input() backLabel: string = 'Înapoi';
	
	/** Surface theme for color adaptation */
	@Input() surface: 'default' | 'light' | 'dark' = 'default';
	
	/** Primary action button (right side on desktop, phone icon on mobile) */
	@Input() primaryAction?: HeaderAction;
	
	/** Secondary action button (right side on desktop only) */
	@Input() secondaryAction?: HeaderAction;
	
	/** Whether to show the back button */
	@Input() showBackButton: boolean = true;
	
	/** Accessibility label for the header element */
	@Input() ariaLabel?: string;

	/** Emitted when back button is clicked */
	@Output() backClicked = new EventEmitter<MouseEvent>();
	
	/** Emitted when primary action button is clicked */
	@Output() primaryActionClicked = new EventEmitter<MouseEvent>();
	
	/** Emitted when secondary action button is clicked */
	@Output() secondaryActionClicked = new EventEmitter<MouseEvent>();

	/**
	 * Handles back button click events
	 * @param event - Mouse click event
	 */
	onBackClick(event: MouseEvent): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.backClicked.emit(event);
	}

	/**
	 * Handles primary action button click events
	 * @param event - Mouse click event
	 */
	onPrimaryActionClick(event: MouseEvent): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.primaryActionClicked.emit(event);
	}

	/**
	 * Handles secondary action button click events
	 * @param event - Mouse click event
	 */
	onSecondaryActionClick(event: MouseEvent): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.secondaryActionClicked.emit(event);
	}
} 
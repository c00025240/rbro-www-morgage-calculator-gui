import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PageShellSurface = 'default' | 'light' | 'dark';
export type PageShellBreakpoint = 's' | 'tb' | 'l' | 'xl';

/**
 * PageShell Component - Molecule Level
 * 
 * A foundational layout component that provides the main page structure with responsive breakpoints
 * and theme-aware background colors.
 * 
 * @example
 * ```html
 * <ms-page-shell surface="light">
 *   <ms-header>Header content</ms-header>
 *   <main>Page content</main>
 * </ms-page-shell>
 * ```
 * 
 * @features
 * - Responsive breakpoints: s (<480px), tb (<1024px), l (≤1440px), xl (>1440px)
 * - Theme support: default, light, dark backgrounds
 * - Full viewport height layout
 * - Content projection with ng-content
 */
@Component({
	selector: 'ms-page-shell',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ms-page-shell.html',
	styleUrls: ['./ms-page-shell.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsPageShell {
	/** Surface theme for background color adaptation */
	@Input() surface: PageShellSurface = 'default';
	
	/** Optional CSS class for additional styling */
	@Input() cssClass?: string;
	
	/** Whether to use full viewport height */
	@Input() fullHeight: boolean = true;
	
	/** Whether to add overflow handling */
	@Input() scrollable: boolean = true;
} 
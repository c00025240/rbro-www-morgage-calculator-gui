import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output, computed, signal, ViewEncapsulation, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, of, takeUntil } from 'rxjs';

export type ButtonSurface = 'default' | 'light' | 'dark';
export type IconPosition = 'left' | 'right';
export type ButtonDevice = 'mobile' | 'tablet' | 'desktop';

@Component({
	selector: 'ms-button-primary',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ms-button-primary.html',
	styleUrls: ['./ms-button-primary.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MsButtonPrimary implements OnInit, OnDestroy {
	@Input() label: string = '';
	@Input() disabled: boolean = false;
	@Input() surface: ButtonSurface = 'default';
	@Input() device?: ButtonDevice; // optional override for height; if not provided, media queries apply
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Input() ariaLabel?: string;
	@Input() title?: string;

	// Icons (SVG name in /icons folder)
	@Input() iconLeft?: string;
	@Input() iconRight?: string;

	@Output() clicked = new EventEmitter<MouseEvent>();
	@Output() focused = new EventEmitter<FocusEvent>();
	@Output() blurred = new EventEmitter<FocusEvent>();

	private _isPressed = signal(false);
	private _isFocused = signal(false);
	private leftIconHtml = signal<SafeHtml | null>(null);
	private rightIconHtml = signal<SafeHtml | null>(null);
	private destroy$ = new Subject<void>();

	constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		if (this.iconLeft) this.loadIcon(this.iconLeft, 'left');
		if (this.iconRight) this.loadIcon(this.iconRight, 'right');
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	buttonClasses = computed(() => {
		const classes = [
			'ms-button-primary',
			`ms-button-primary--surface-${this.surface}`,
			this.disabled ? 'is-disabled' : '',
			this._isPressed() ? 'is-pressed' : '',
			this._isFocused() ? 'is-focused' : '',
			this.device ? `ms-button-primary--device-${this.device}` : ''
		].filter(Boolean);
		return classes.join(' ');
	});

	@HostBinding('class') get cssClass() { return this.buttonClasses(); }

	@HostListener('click', ['$event']) onClick(event: MouseEvent) {
		if (this.disabled) { event.preventDefault(); event.stopPropagation(); return; }
		this.clicked.emit(event);
	}

	@HostListener('focus', ['$event']) onFocus(event: FocusEvent) {
		this._isFocused.set(true);
		this.focused.emit(event);
	}

	@HostListener('blur', ['$event']) onBlur(event: FocusEvent) {
		this._isFocused.set(false);
		this.blurred.emit(event);
	}

	@HostListener('mousedown') onMouseDown() { this._isPressed.set(true); }
	@HostListener('mouseup') onMouseUp() { this._isPressed.set(false); }
	@HostListener('mouseleave') onMouseLeave() { this._isPressed.set(false); }

	getLeftIcon(): SafeHtml | null { return this.leftIconHtml(); }
	getRightIcon(): SafeHtml | null { return this.rightIconHtml(); }

	private loadIcon(iconName: string, side: 'left' | 'right'): void {
		const possibleFilenames = [
			`${iconName}-outlined.svg`,
			`${iconName}.svg`,
			`${iconName} Style=outlined.svg`,
			`${iconName} Style=Outlined.svg`,
			`${iconName} Style=outline.svg`
		];
		this.tryLoadIconFiles(possibleFilenames, 0, side, iconName);
	}

	private tryLoadIconFiles(filenames: string[], index: number, side: 'left' | 'right', iconName: string): void {
		if (index >= filenames.length) {
			const fallback = this.getFallbackIconSvg();
			const processed = this.processSvgContent(fallback);
			const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
			(side === 'left' ? this.leftIconHtml : this.rightIconHtml).set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
			return;
		}
		const url = `/assets/icons/${encodeURIComponent(filenames[index])}`;
		this.http.get(url, { responseType: 'text' })
			.pipe(catchError(() => { this.tryLoadIconFiles(filenames, index + 1, side, iconName); return of(null); }), takeUntil(this.destroy$))
			.subscribe((svg: string | null) => {
				if (!svg) return;
				const processed = this.processSvgContent(svg);
				const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
				(side === 'left' ? this.leftIconHtml : this.rightIconHtml).set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
			});
	}

	private processSvgContent(svgContent: string): string {
		let processedSvg = svgContent;
		processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
		processedSvg = processedSvg.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
		return processedSvg;
	}

	private getFallbackIconSvg(): string {
		return '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="currentColor"/></svg>';
	}
} 
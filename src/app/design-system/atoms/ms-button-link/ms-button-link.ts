import { Component, Input, Output, EventEmitter, ViewEncapsulation, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'ms-button-link',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ms-button-link.html',
	styleUrls: ['./ms-button-link.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MsButtonLink {
	@Input() label: string = '';
	@Input() disabled: boolean = false;
	@Input() surface: 'default' | 'light' | 'dark' = 'default';
	@Input() device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Input() ariaLabel?: string;
	@Input() title?: string;
	@Input() iconLeft?: string;
	@Input() iconRight?: string;

	@Output() clicked = new EventEmitter<Event>();
	@Output() focused = new EventEmitter<Event>();
	@Output() blurred = new EventEmitter<Event>();

	isPressed = false;
	isFocused = false;
	leftIconContent?: SafeHtml;
	rightIconContent?: SafeHtml;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {
		if (this.iconLeft) {
			this.loadIcon(this.iconLeft, 'left');
		}
		if (this.iconRight) {
			this.loadIcon(this.iconRight, 'right');
		}
	}

	async loadIcon(iconName: string, position: 'left' | 'right') {
		try {
			const response = await fetch(`/assets/icons/${iconName}.svg`);
			if (response.ok) {
				const svgContent = await response.text();
				const processedSvg = this.processSvgContent(svgContent);
				const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedSvg);
				
				if (position === 'left') {
					this.leftIconContent = sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : undefined;
				} else {
					this.rightIconContent = sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : undefined;
				}
			}
		} catch (error) {
			console.error(`Failed to load icon: ${iconName}`, error);
		}
	}

	private processSvgContent(svgContent: string): string {
		let processedSvg = svgContent;
		
		// Remove any script tags and event handlers for security
		processedSvg = processedSvg.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
		processedSvg = processedSvg.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
		processedSvg = processedSvg.replace(/on\w+\s*=\s*{[^}]*}/gi, '');
		processedSvg = processedSvg.replace(/javascript:/gi, '');
		
		// Replace fill and stroke attributes with currentColor
		processedSvg = processedSvg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
		processedSvg = processedSvg.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
		
		return processedSvg;
	}

	onClick(event: Event) {
		if (!this.disabled) {
			this.clicked.emit(event);
		}
	}

	onFocus(event: Event) {
		this.isFocused = true;
		this.focused.emit(event);
	}

	onBlur(event: Event) {
		this.isFocused = false;
		this.blurred.emit(event);
	}

	onMouseDown() {
		this.isPressed = true;
	}

	onMouseUp() {
		this.isPressed = false;
	}

	onMouseLeave() {
		this.isPressed = false;
	}
} 
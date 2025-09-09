import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
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
				
				if (position === 'left') {
					this.leftIconContent = this.sanitizer.bypassSecurityTrustHtml(processedSvg);
				} else {
					this.rightIconContent = this.sanitizer.bypassSecurityTrustHtml(processedSvg);
				}
			}
		} catch (error) {
			console.error(`Failed to load icon: ${iconName}`, error);
		}
	}

	private processSvgContent(svgContent: string): string {
		return svgContent
			.replace(/fill="[^"]*"/g, 'fill="currentColor"')
			.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
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
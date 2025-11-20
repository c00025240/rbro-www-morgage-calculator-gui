import { Component, Input, Output, EventEmitter, HostBinding, HostListener, computed, signal, OnInit, OnDestroy, OnChanges, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Subject, takeUntil } from 'rxjs';

// Button variant types following Angular Material patterns
export type ButtonVariant = 'raised' | 'stroked' | 'flat' | 'basic' | 'icon' | 'fab' | 'mini-fab';
export type ButtonSurface = 'default' | 'light' | 'dark';
export type ButtonDevice = 'mobile' | 'tablet' | 'desktop';
export type IconPosition = 'left' | 'right' | 'only';

export interface IconConfig {
  name: string;
  position: IconPosition;
}

@Component({
  selector: 'rbro-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './ms-button-bare.html',
  styleUrls: ['./ms-button-bare.scss']
})
export class MsButtonBare implements OnInit, OnChanges, OnDestroy {
  
  // Core Button Properties - mapped to Angular Material
  @Input() variant: ButtonVariant = 'raised'; // Angular Material default
  @Input() surface: ButtonSurface = 'default';
  @Input() device?: ButtonDevice;
  @Input() compact: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'primary' | 'accent' | 'warn' | '' = 'primary'; // Angular Material color
  
  // Icon Configuration
  @Input() icon?: IconConfig;
  
  // Accessibility Properties
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() title?: string;
  
  // Event Emitters
  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  
  // Internal state
  private _isPressed = signal(false);
  private _isFocused = signal(false);
  private _iconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();
  
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  // Computed class names for custom styling
  buttonClasses = computed(() => {
    const classes = [
      'rbro-button',
      `rbro-button--${this.variant}`,
      this.surface !== 'default' ? `rbro-button--surface-${this.surface}` : '',
      this.compact ? 'rbro-button--compact' : '',
      this.disabled ? 'rbro-button--disabled' : '',
      this.device ? `rbro-button--device-${this.device}` : '',
      this._isPressed() ? 'rbro-button--pressed' : '',
      this._isFocused() ? 'rbro-button--focused' : ''
    ].filter(Boolean);
    
    return classes.join(' ');
  });
  
  // Host bindings for additional CSS classes
  @HostBinding('class') get cssClass() {
    return this.buttonClasses();
  }
  
  // Event Handlers
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
  
  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent) {
    this._isFocused.set(true);
    this.focused.emit(event);
  }
  
  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    this._isFocused.set(false);
    this.blurred.emit(event);
  }
  
  @HostListener('mousedown')
  onMouseDown() {
    this._isPressed.set(true);
  }
  
  @HostListener('mouseup')
  onMouseUp() {
    this._isPressed.set(false);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this._isPressed.set(false);
  }
  
  // Utility methods for template
  hasIcon(): boolean {
    return !!this.icon;
  }
  
  getIconPosition(): IconPosition {
    return this.icon?.position || 'left';
  }
  
  getMatButtonType(): string {
    // Map our variants to Angular Material button types
    switch (this.variant) {
      case 'raised': return 'mat-raised-button';
      case 'stroked': return 'mat-stroked-button';
      case 'flat': return 'mat-flat-button';
      case 'icon': return 'mat-icon-button';
      case 'fab': return 'mat-fab';
      case 'mini-fab': return 'mat-mini-fab';
      case 'basic':
      default: return 'mat-button';
    }
  }



  private loadIcon(iconName: string): void {
    console.log(`📁 Loading icon: ${iconName}`);
    // Try different filename patterns that exist in the assets folder
    // Prioritize the patterns that work reliably
    const possibleFilenames = [
      `${iconName}-outlined.svg`,           // e.g., money-bag-outlined.svg (PRIORITY - works reliably)
      `${iconName}.svg`,                    // e.g., money-bag.svg (single file icons)
      `${iconName} Style=outlined.svg`,     // e.g., money-bag Style=outlined.svg
      `${iconName} Style=Outlined.svg`,     // e.g., atm Style=Outlined.svg (capital O)
      `${iconName} Style=outline.svg`       // e.g., bookmark Style=outline.svg (no d)
    ];

    console.log(`🔍 Will try these filenames:`, possibleFilenames);
    this.tryLoadIconFiles(possibleFilenames, 0);
  }

  private tryLoadIconFiles(filenames: string[], index: number): void {
    if (index >= filenames.length) {
      console.warn(`❌ Could not load icon: ${this.icon?.name}. Tried all patterns.`);
      const fallbackSvg = this.getFallbackIconSvg();
      const processedFallback = this.processSvgContent(fallbackSvg);
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedFallback);
      this._iconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
      return;
    }

    const filename = filenames[index];
    // Always use proper URL encoding - Angular HttpClient handles this correctly
    const url = `/assets/icons/${encodeURIComponent(filename)}`;
    
    console.log(`🌐 Trying to load: ${url}`);

    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.log(`⚠️ Failed to load ${url}, trying next...`, error);
          // Try next filename pattern
          this.tryLoadIconFiles(filenames, index + 1);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((svgContent: string | null) => {
        if (svgContent) {
          console.log(`✅ Successfully loaded: ${url}`);
          // Process SVG to remove hardcoded fills before injection
          const processedSvg = this.processSvgContent(svgContent);
          const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processedSvg);
          this._iconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
        }
      });
  }

  private processSvgContent(svgContent: string): string {
    // Replace hardcoded fill attributes with currentColor for proper color inheritance
    // This fixes the icon color inheritance issue by allowing CSS to control colors
    const originalSvg = svgContent;
    let processedSvg = svgContent;
    
    // Remove any script tags and event handlers for security
    processedSvg = processedSvg.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*{[^}]*}/gi, '');
    processedSvg = processedSvg.replace(/javascript:/gi, '');
    
    // Replace fill attributes with hex color values with currentColor (but keep fill="none")
    // This regex matches fill="#color" or fill='#color' patterns and replaces them
    processedSvg = processedSvg.replace(/fill=["']#[a-fA-F0-9]{3,8}["']/g, 'fill="currentColor"');
    
    // Replace fill attributes with named colors with currentColor (but preserve fill="none", fill="currentColor", fill="inherit")
    processedSvg = processedSvg.replace(/fill=["']((?!none|currentColor|inherit)[a-zA-Z]+)["']/g, 'fill="currentColor"');
    
    // Clean up any double spaces that might result from replacements
    processedSvg = processedSvg.replace(/\s+/g, ' ');
    
    const wasModified = originalSvg !== processedSvg;
    console.log(`🎨 SVG Processing ${wasModified ? '✅ MODIFIED' : '⚪ UNCHANGED'} - replaced hardcoded fills with currentColor`);
    
    if (wasModified) {
      console.log(`📝 Before: ${originalSvg.substring(0, 200)}...`);
      console.log(`📝 After:  ${processedSvg.substring(0, 200)}...`);
    }
    
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    // Provide a simple fallback SVG string (to be processed like other SVGs)
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <text x="12" y="14" text-anchor="middle" font-size="10" fill="currentColor">${this.icon?.name?.charAt(0).toUpperCase() || '?'}</text>
    </svg>`;
  }

  ngOnInit(): void {
    if (this.icon?.name) {
      console.log(`🔍 Button initializing with icon: ${this.icon.name}`);
      this.loadIcon(this.icon.name);
    }
  }

  ngOnChanges(): void {
    if (this.icon?.name) {
      console.log(`🔄 Button icon changed to: ${this.icon.name}`);
      this.loadIcon(this.icon.name);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getIconHtml(): SafeHtml | null {
    return this._iconHtml();
  }
}

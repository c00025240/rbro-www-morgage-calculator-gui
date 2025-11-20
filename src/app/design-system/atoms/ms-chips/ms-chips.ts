import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, OnDestroy, signal, computed, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, of, takeUntil } from 'rxjs';

export interface ChipItem {
  id: string | number;
  label?: string;  // Made optional for icon-only chips
  disabled?: boolean;
  selected?: boolean;
  iconLeft?: string;
  iconRight?: string;
}

@Component({
  selector: 'ms-chips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-chips.html',
  styleUrls: ['./ms-chips.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsChips implements OnInit, OnDestroy {
  @Input() chips: ChipItem[] = [];
  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() disabled: boolean = false;
  @Input() selectable: boolean = false; // For filter chips
  @Input() multiple: boolean = false; // For multiple selection
  @Input() infoOnly: boolean = false; // For display-only chips (no interactions)
  @Input() ariaLabel: string = '';

  @Output() chipClicked = new EventEmitter<ChipItem>();
  @Output() chipSelected = new EventEmitter<{ chip: ChipItem; selected: boolean }>();

  // Track processed icons for each chip using signals
  private chipIconsMap = new Map<string | number, { 
    leftIcon: ReturnType<typeof signal<SafeHtml | null>>;
    rightIcon: ReturnType<typeof signal<SafeHtml | null>>;
  }>();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadAllIcons();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges() {
    this.loadAllIcons();
  }

  loadAllIcons() {
    // Clear existing icons
    this.chipIconsMap.clear();
    
    for (const chip of this.chips) {
      this.loadIconsForChip(chip);
    }
  }

  loadIconsForChip(chip: ChipItem) {
    // Always create new signal holders for each chip
    const iconSignals = {
      leftIcon: signal<SafeHtml | null>(null),
      rightIcon: signal<SafeHtml | null>(null)
    };
    
    this.chipIconsMap.set(chip.id, iconSignals);

    if (chip.iconLeft) {
      this.loadIcon(chip.iconLeft, iconSignals.leftIcon);
    }
    if (chip.iconRight) {
      this.loadIcon(chip.iconRight, iconSignals.rightIcon);
    }
  }

  private loadIcon(iconName: string, iconSignal: ReturnType<typeof signal<SafeHtml | null>>): void {
    const possibleFilenames = [
      `${iconName}-outlined.svg`,
      `${iconName}.svg`,
      `${iconName} Style=outlined.svg`,
      `${iconName} Style=Outlined.svg`,
      `${iconName} Style=outline.svg`
    ];
    this.tryLoadIconFiles(possibleFilenames, 0, iconSignal, iconName);
  }

  private tryLoadIconFiles(filenames: string[], index: number, iconSignal: ReturnType<typeof signal<SafeHtml | null>>, iconName: string): void {
    if (index >= filenames.length) {
      const fallback = this.getFallbackIconSvg();
      const processed = this.processSvgContent(fallback);
      // Only trust processed SVG if sanitization passes
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
      if (sanitized) {
        iconSignal.set(this.sanitizer.bypassSecurityTrustHtml(sanitized));
      } else {
        // If sanitization fails, use a safe fallback instead of trusting processed content
        const safeFallback = this.getFallbackIconSvg();
        const safeProcessed = this.processSvgContent(safeFallback);
        const safeSanitized = this.sanitizer.sanitize(SecurityContext.HTML, safeProcessed);
        iconSignal.set(safeSanitized ? this.sanitizer.bypassSecurityTrustHtml(safeSanitized) : null);
      }
      return;
    }
    const url = `/assets/icons/${encodeURIComponent(filenames[index])}`;
    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError(() => { 
          this.tryLoadIconFiles(filenames, index + 1, iconSignal, iconName); 
          return of(null); 
        }), 
        takeUntil(this.destroy$)
      )
      .subscribe((svg: string | null) => {
        if (!svg) return;
        const processed = this.processSvgContent(svg);
        // Only trust processed SVG if sanitization passes
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
        if (sanitized) {
          iconSignal.set(this.sanitizer.bypassSecurityTrustHtml(sanitized));
        } else {
          // If sanitization fails, don't render the icon (security: don't trust unsafe content)
          iconSignal.set(null);
        }
      });
  }

  private processSvgContent(svgContent: string): string {
    let processedSvg = svgContent;
    
    // Remove any script tags and event handlers for security
    processedSvg = processedSvg.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    processedSvg = processedSvg.replace(/on\w+\s*=\s*{[^}]*}/gi, '');
    processedSvg = processedSvg.replace(/javascript:/gi, '');
    
    // Replace fill and stroke attributes with currentColor
    processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
    
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    // Fallback arrow down icon
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 14.4393L19.2928 7.14641L20.707 8.56062L12.707 16.5606C12.3165 16.9511 11.6833 16.9511 11.2928 16.5606L3.29282 8.56062L4.70703 7.14641L11.9999 14.4393Z" fill="currentColor"/></svg>';
  }

  onChipClick(chip: ChipItem) {
    if (chip.disabled || this.disabled || this.infoOnly) return;

    if (this.selectable) {
      if (!this.multiple) {
        // Single selection - deselect others
        this.chips.forEach(c => c.selected = false);
      }
      chip.selected = !chip.selected;
      this.chipSelected.emit({ chip, selected: chip.selected });
    }

    this.chipClicked.emit(chip);
  }

  getChipClasses(chip: ChipItem): string[] {
    const classes = [
      'ms-chips__chip',
      `ms-chips__chip--${this.type}`,
      `ms-chips__chip--surface-${this.surface}`
    ];

    if (chip.disabled || this.disabled) {
      classes.push('ms-chips__chip--disabled');
    }

    if (this.infoOnly) {
      classes.push('ms-chips__chip--info-only');
    }

    if (chip.selected) {
      classes.push('ms-chips__chip--selected');
    }

    // Icon-only chip
    if (!chip.label && (chip.iconLeft || chip.iconRight)) {
      classes.push('ms-chips__chip--icon-only');
    }

    return classes;
  }

  getLeftIcon(chipId: string | number): SafeHtml | null {
    const iconSignals = this.chipIconsMap.get(chipId);
    if (!iconSignals) return null;
    return iconSignals.leftIcon();
  }

  getRightIcon(chipId: string | number): SafeHtml | null {
    const iconSignals = this.chipIconsMap.get(chipId);
    if (!iconSignals) return null;
    return iconSignals.rightIcon();
  }

  trackByChipId(index: number, chip: ChipItem): string | number {
    return chip.id;
  }
}

import { Component, Input, ViewEncapsulation, OnInit, OnDestroy, signal, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, catchError, of, takeUntil } from 'rxjs';

@Component({
  selector: 'ms-savings-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-savings-chip.html',
  styleUrls: ['./ms-savings-chip.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsSavingsChip implements OnInit, OnDestroy {
  @Input() text: string = '';
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() disabled: boolean = false;
  @Input() infoOnly: boolean = false; // For display-only chip (no interactions)
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() fullWidth: boolean = false;

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

  getSavingsChipClasses(): string[] {
    const classes = [
      'ms-savings-chip',
      `ms-savings-chip--size-${this.size}`
    ];

    if (this.disabled) {
      classes.push('ms-savings-chip--disabled');
    }

    if (this.infoOnly) {
      classes.push('ms-savings-chip--info-only');
    }

    if (this.fullWidth) {
      classes.push('ms-savings-chip--full-width');
    }

    return classes;
  }

  getLeftIcon(): SafeHtml | null {
    return this.leftIconHtml();
  }

  getRightIcon(): SafeHtml | null {
    return this.rightIconHtml();
  }

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
      .pipe(
        catchError(() => { 
          this.tryLoadIconFiles(filenames, index + 1, side, iconName); 
          return of(null); 
        }), 
        takeUntil(this.destroy$)
      )
      .subscribe((svg: string | null) => {
        if (!svg) return;
        const processed = this.processSvgContent(svg);
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
        (side === 'left' ? this.leftIconHtml : this.rightIconHtml).set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
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
    return '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>';
  }
} 
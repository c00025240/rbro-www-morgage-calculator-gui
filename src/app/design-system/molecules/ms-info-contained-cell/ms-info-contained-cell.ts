import { Component, SecurityContext, Input, Output, EventEmitter, ViewEncapsulation, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, catchError, of, takeUntil } from 'rxjs';

export type InfoCellType = 'info' | 'error' | 'success';

@Component({
  selector: 'ms-info-contained-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-info-contained-cell.html',
  styleUrls: ['./ms-info-contained-cell.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsInfoContainedCell implements OnInit, OnDestroy {
  @Input() type: InfoCellType = 'info';
  @Input() text: string = '';
  @Input() leftIcon?: string;
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  private leftIconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.leftIcon) {
      this.loadIcon(this.leftIcon);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  containerClasses = computed(() => {
    const classes = [
      'ms-info-contained-cell',
      `ms-info-contained-cell--${this.type}`,
      this.disabled ? 'ms-info-contained-cell--disabled' : ''
    ];
    return classes.filter(Boolean);
  });

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  getLeftIcon(): SafeHtml | null {
    return this.leftIconHtml();
  }

  private loadIcon(iconName: string): void {
    const possibleFilenames = [
      `${iconName}-outlined.svg`,
      `${iconName}.svg`,
      `${iconName} Style=outlined.svg`,
      `${iconName} Style=Outlined.svg`,
      `${iconName} Style=outline.svg`
    ];
    this.tryLoadIconFiles(possibleFilenames, 0, iconName);
  }

  private tryLoadIconFiles(filenames: string[], index: number, iconName: string): void {
    if (index >= filenames.length) {
      const fallback = this.getFallbackIconSvg();
      const processed = this.processSvgContent(fallback);
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
      this.leftIconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
      return;
    }
    const url = `/assets/icons/${encodeURIComponent(filenames[index])}`;
    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError(() => { 
          this.tryLoadIconFiles(filenames, index + 1, iconName); 
          return of(null); 
        }), 
        takeUntil(this.destroy$)
      )
      .subscribe((svg: string | null) => {
        if (!svg) return;
        const processed = this.processSvgContent(svg);
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, processed);
      this.leftIconHtml.set(sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null);
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
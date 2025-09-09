import { Component, Input, Output, EventEmitter, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { MsToggle } from '../../atoms/ms-toggle/ms-toggle';

@Component({
  selector: 'ms-switch-cell',
  standalone: true,
  imports: [CommonModule, MsToggle],
  templateUrl: './ms-switch-cell.html',
  styleUrls: ['./ms-switch-cell.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsSwitchCell {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() showInfoIcon: boolean = false;
  @Input() infoTooltip: string = '';

  @Output() change = new EventEmitter<{ checked: boolean }>();
  @Output() infoClick = new EventEmitter<void>();

  private infoIconHtml = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();
  private isHovered = signal<boolean>(false);

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.showInfoIcon) {
      this.loadInfoIcon();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleChange(event: { checked: boolean }): void {
    this.checked = event.checked;
    this.change.emit(event);
  }

  onInfoIconClick(): void {
    this.infoClick.emit();
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  getSwitchCellClasses(): string[] {
    const classes = [
      'ms-switch-cell',
      `ms-switch-cell--surface-${this.surface}`
    ];

    if (this.disabled) {
      classes.push('ms-switch-cell--disabled');
    }

    if (this.isHovered()) {
      classes.push('ms-switch-cell--hovered');
    }

    return classes;
  }

  getInfoIcon(): SafeHtml | null {
    return this.infoIconHtml();
  }

  private loadInfoIcon(): void {
    const possibleFilenames = [
      'info-outlined.svg',
      'info.svg',
      'info Style=outlined.svg'
    ];
    this.tryLoadIconFiles(possibleFilenames, 0);
  }

  private tryLoadIconFiles(filenames: string[], index: number): void {
    if (index >= filenames.length) {
      const fallback = this.getFallbackInfoIcon();
      const processed = this.processSvgContent(fallback);
      this.infoIconHtml.set(this.sanitizer.bypassSecurityTrustHtml(processed));
      return;
    }

    const url = `/assets/icons/${encodeURIComponent(filenames[index])}`;
    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError(() => { 
          this.tryLoadIconFiles(filenames, index + 1); 
          return of(null); 
        }), 
        takeUntil(this.destroy$)
      )
      .subscribe((svg: string | null) => {
        if (!svg) return;
        const processed = this.processSvgContent(svg);
        this.infoIconHtml.set(this.sanitizer.bypassSecurityTrustHtml(processed));
      });
  }

  private processSvgContent(svgContent: string): string {
    let processedSvg = svgContent;
    // Only replace fill colors, but preserve stroke="none" and don't add strokes where they don't exist
    processedSvg = processedSvg.replace(/fill="(?!none|white)[^"]*"/g, 'fill="currentColor"');
    // Only replace existing stroke colors, don't add strokes
    processedSvg = processedSvg.replace(/stroke="(?!none|white)[^"]*"/g, 'stroke="currentColor"');
    return processedSvg;
  }

  private getFallbackInfoIcon(): string {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="currentColor"/>
      <line x1="12" y1="16" x2="12" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="9" r="1" fill="white"/>
    </svg>`;
  }
} 
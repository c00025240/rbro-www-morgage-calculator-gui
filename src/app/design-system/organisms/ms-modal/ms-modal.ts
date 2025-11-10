import { Component, Input, Output, EventEmitter, HostListener, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsButtonSecondary } from '../../atoms/ms-button-secondary/ms-button-secondary';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'ms-modal',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MsCardOutsideTitleComponent, MsButtonSecondary],
  templateUrl: './ms-modal.html',
  styleUrls: ['./ms-modal.scss']
})
export class MsModal implements OnInit {
  @Input() title: string = '';
  @Input() isVisible: boolean = false;
  @Input() hasFooter: boolean = false;
  @Input() footerButtonLabel: string = 'Confirm';
  @Input() surface: 'light' | 'dark' = 'light';
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() footerButtonClick = new EventEmitter<void>();

  closeIconHtml: SafeHtml | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadCloseIcon();
  }

  private loadCloseIcon() {
    this.http.get('/assets/icons/close.svg', { responseType: 'text' })
      .pipe(
        catchError(() => of('<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0001 13.4142L4.70718 20.7071L3.29297 19.2928L10.5859 12L3.29297 4.70706L4.70718 3.29285L12.0001 10.5857L19.293 3.29285L20.7072 4.70706L13.4143 12L20.7072 19.2928L19.293 20.7071L12.0001 13.4142Z" fill="currentColor"/></svg>'))
      )
      .subscribe(svg => {
        // Ensure SVG uses currentColor for theming
        const themedSvg = svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, themedSvg);
        this.closeIconHtml = sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null;
      });
  }

  onClose() {
    this.closeModal.emit();
  }

  onFooterButtonClick() {
    this.footerButtonClick.emit();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isVisible) {
      this.onClose();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get modalClasses(): string[] {
    const classes = ['ms-modal'];
    
    if (this.isVisible) {
      classes.push('ms-modal--visible');
    }
    
    return classes;
  }

  get containerClasses(): string[] {
    const classes = ['ms-modal__container'];
    
    if (this.hasFooter) {
      classes.push('ms-modal__container--with-footer');
    }
    
    if (this.surface === 'dark') {
      classes.push('ms-modal__container--surface-dark');
    }
    
    return classes;
  }

  get footerClasses(): string[] {
    const classes = ['ms-modal__footer'];
    
    if (this.surface === 'dark') {
      classes.push('ms-modal__footer--surface-dark');
    }
    
    return classes;
  }

  get headerClasses(): string[] {
    const classes = ['ms-modal__header'];
    classes.push(`ms-modal__header--surface-${this.surface}`);
    return classes;
  }

  get closeButtonClasses(): string[] {
    const classes = ['ms-modal__close-button'];
    classes.push(`ms-modal__close-button--surface-${this.surface}`);
    return classes;
  }
}

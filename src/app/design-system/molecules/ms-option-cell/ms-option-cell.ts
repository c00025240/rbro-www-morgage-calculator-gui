import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, of, takeUntil } from 'rxjs';

@Component({
  selector: 'ms-option-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-option-cell.html',
  styleUrls: ['./ms-option-cell.scss']
})
export class MsOptionCell implements OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() optionClick = new EventEmitter<void>();

  // Icon signals
  iconContent = signal<SafeHtml | null>(null);
  private destroy$ = new Subject<void>();
  isHovered = signal<boolean>(false);

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadIcon();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.loadIcon();
  }

  onOptionClick(): void {
    if (this.disabled) return;
    console.log('OptionCell clicked:', this.label);
    this.optionClick.emit();
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  getOptionCellClasses(): string[] {
    const classes = [
      'ms-option-cell',
      `ms-option-cell--surface-${this.surface}`
    ];

    if (this.selected) {
      classes.push('ms-option-cell--selected');
    }

    if (this.disabled) {
      classes.push('ms-option-cell--disabled');
    }

    if (this.isHovered()) {
      classes.push('ms-option-cell--hovered');
    }

    return classes;
  }

  get iconName(): string {
    return this.selected ? 'checkmark-Style=outlined' : 'forward';
  }

  private loadIcon(): void {
    const iconName = this.iconName;
    console.log('OptionCell: Loading icon:', iconName);
    
    // Handle different icon names with proper filenames
    let possibleFilenames: string[] = [];
    
    if (iconName === 'forward') {
      possibleFilenames = ['forward.svg'];
    } else if (iconName === 'checkmark-Style=outlined') {
      possibleFilenames = [
        'checkmark Style=outlined.svg',
        'checkmark-Style=outlined.svg',
        'checkmark-outlined.svg'
      ];
    } else {
      possibleFilenames = [
        `${iconName}.svg`,
        `${iconName} Style=outlined.svg`,
        `${iconName} Style=Outlined.svg`,
        `${iconName}-outlined.svg`,
        `${iconName} Style=outline.svg`
      ];
    }
    
    console.log('OptionCell: Trying filenames:', possibleFilenames);
    this.tryLoadIconFiles(possibleFilenames, 0, iconName);
  }

  private tryLoadIconFiles(filenames: string[], index: number, iconName: string): void {
    if (index >= filenames.length) {
      console.log('OptionCell: All icon files failed, using fallback for:', iconName);
      const fallback = this.getFallbackIconSvg();
      const processed = this.processSvgContent(fallback);
      this.iconContent.set(this.sanitizer.bypassSecurityTrustHtml(processed));
      return;
    }

    const url = `/assets/icons/${encodeURIComponent(filenames[index])}`;
    console.log('OptionCell: Trying to load icon from:', url);
    this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.log('OptionCell: Failed to load icon:', url, error);
          this.tryLoadIconFiles(filenames, index + 1, iconName);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((svg: string | null) => {
        if (!svg) return;
        console.log('OptionCell: Successfully loaded icon:', url, svg.substring(0, 100) + '...');
        const processed = this.processSvgContent(svg);
        this.iconContent.set(this.sanitizer.bypassSecurityTrustHtml(processed));
      });
  }

  private processSvgContent(svgContent: string): string {
    let processedSvg = svgContent;
    // Replace any fill color with currentColor (except 'none')
    processedSvg = processedSvg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
    processedSvg = processedSvg.replace(/fill='(?!none)[^']*'/g, "fill='currentColor'");
    // Ensure the SVG has proper dimensions
    if (!processedSvg.includes('width=') && !processedSvg.includes('height=')) {
      processedSvg = processedSvg.replace('<svg', '<svg width="24" height="24"');
    }
    return processedSvg;
  }

  private getFallbackIconSvg(): string {
    // Fallback forward arrow as SVG path
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.99994 11.0206L1.99994 13.0206L18.4853 13.0206L12.6526 18.5719L14.0314 20.0206L21.6894 12.7322C22.1032 12.3383 22.1036 11.6785 21.6902 11.2842L14.0322 3.97949L12.6518 5.4267L18.5163 11.0206L1.99994 11.0206Z" fill="currentColor"/>
    </svg>`;
  }
} 
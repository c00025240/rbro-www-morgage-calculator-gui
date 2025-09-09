import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TypographyStyle {
  name: string;
  cssClass: string;
  description: string;
  usage: string;
  category: string;
  desktopSize: string;
  tabletSize: string;
  mobileSize: string;
}

@Component({
  selector: 'ms-ms-typography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-typography.html',
  styleUrl: './ms-typography.scss'
})
export class MsTypography implements OnInit {
  // Storybook Controls Inputs
  @Input() selectedFontWeight: string = 'regular';
  @Input() selectedTypographyStyle: string = 'h1';
  @Input() demoText: string = 'The quick brown fox jumps over the lazy dog';
  @Input() showResponsiveSizes: boolean = true;
  @Input() showUsageGuidelines: boolean = true;
  @Input() showCodeExamples: boolean = true;
  @Input() colorTheme: string = 'default';

  typographyStyles: TypographyStyle[] = [
    // Display Typography
    {
      name: 'Display 1',
      cssClass: 'display-1',
      description: 'Largest display text for hero sections and major headlines',
      usage: 'Hero headlines, landing page titles',
      category: 'display',
      desktopSize: '72px',
      tabletSize: '56px',
      mobileSize: '44px'
    },
    {
      name: 'Display 2',
      cssClass: 'display-2',
      description: 'Large display text for section headers',
      usage: 'Section titles, feature headlines',
      category: 'display',
      desktopSize: '60px',
      tabletSize: '48px',
      mobileSize: '36px'
    },
    {
      name: 'Display 3',
      cssClass: 'display-3',
      description: 'Medium display text for subsection headers',
      usage: 'Subsection titles, card headers',
      category: 'display',
      desktopSize: '48px',
      tabletSize: '40px',
      mobileSize: '32px'
    },

    // Heading Typography
    {
      name: 'Heading 1',
      cssClass: 'h1',
      description: 'Primary page heading',
      usage: 'Page titles, main content headers',
      category: 'heading',
      desktopSize: '40px',
      tabletSize: '36px',
      mobileSize: '30px'
    },
    {
      name: 'Heading 2',
      cssClass: 'h2',
      description: 'Secondary section heading',
      usage: 'Section headers, content blocks',
      category: 'heading',
      desktopSize: '32px',
      tabletSize: '30px',
      mobileSize: '24px'
    },
    {
      name: 'Heading 3',
      cssClass: 'h3',
      description: 'Tertiary section heading',
      usage: 'Subsection headers, card titles',
      category: 'heading',
      desktopSize: '28px',
      tabletSize: '24px',
      mobileSize: '22px'
    },
    {
      name: 'Heading 4',
      cssClass: 'h4',
      description: 'Component-level heading',
      usage: 'Component headers, form sections',
      category: 'heading',
      desktopSize: '24px',
      tabletSize: '22px',
      mobileSize: '20px'
    },
    {
      name: 'Heading 5',
      cssClass: 'h5',
      description: 'Small section heading',
      usage: 'Small sections, list headers',
      category: 'heading',
      desktopSize: '20px',
      tabletSize: '18px',
      mobileSize: '18px'
    },
    {
      name: 'Heading 6',
      cssClass: 'h6',
      description: 'Smallest heading level',
      usage: 'Minor sections, metadata',
      category: 'heading',
      desktopSize: '18px',
      tabletSize: '16px',
      mobileSize: '16px'
    },

    // Body Typography
    {
      name: 'Body Large',
      cssClass: 'body-large',
      description: 'Large body text for important content',
      usage: 'Introduction text, highlighted content',
      category: 'body',
      desktopSize: '18px',
      tabletSize: '16px',
      mobileSize: '16px'
    },
    {
      name: 'Body',
      cssClass: 'body',
      description: 'Standard body text for all content',
      usage: 'Paragraphs, descriptions, general content',
      category: 'body',
      desktopSize: '16px',
      tabletSize: '14px',
      mobileSize: '14px'
    },
    {
      name: 'Body Small',
      cssClass: 'body-small',
      description: 'Small body text for secondary content',
      usage: 'Fine print, metadata, helper text',
      category: 'body',
      desktopSize: '14px',
      tabletSize: '13px',
      mobileSize: '13px'
    },

    // UI Typography
    {
      name: 'Button',
      cssClass: 'button',
      description: 'Text for buttons and interactive elements',
      usage: 'Buttons, links, CTAs',
      category: 'ui',
      desktopSize: '16px',
      tabletSize: '16px',
      mobileSize: '14px'
    },
    {
      name: 'Caption',
      cssClass: 'caption',
      description: 'Small text for captions and annotations',
      usage: 'Image captions, footnotes, labels',
      category: 'ui',
      desktopSize: '12px',
      tabletSize: '12px',
      mobileSize: '11px'
    },
    {
      name: 'Overline',
      cssClass: 'overline',
      description: 'Uppercase text for category labels',
      usage: 'Category labels, section identifiers',
      category: 'ui',
      desktopSize: '12px',
      tabletSize: '12px',
      mobileSize: '11px'
    }
  ];

  fontWeights = [
    { name: 'Thin', weight: '100', class: 'font-thin' },
    { name: 'Light', weight: '300', class: 'font-light' },
    { name: 'Regular', weight: '400', class: 'font-regular' },
    { name: 'Medium', weight: '500', class: 'font-medium' },
    { name: 'Bold', weight: '700', class: 'font-bold' },
    { name: 'Black', weight: '900', class: 'font-black' }
  ];

  ngOnInit() {
    // Component initialization
  }

  getStylesByCategory(category: string): TypographyStyle[] {
    return this.typographyStyles.filter(style => style.category === category);
  }

  getCategories(): string[] {
    return ['display', 'heading', 'body', 'ui'];
  }

  getCategoryTitle(category: string): string {
    const titles: { [key: string]: string } = {
      'display': 'Display Typography',
      'heading': 'Heading Typography', 
      'body': 'Body Typography',
      'ui': 'UI Typography'
    };
    return titles[category] || category;
  }
}

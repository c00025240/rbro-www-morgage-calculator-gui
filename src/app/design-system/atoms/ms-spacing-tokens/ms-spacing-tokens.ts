import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SpacingToken {
  name: string;
  token: string;
  value: string;
  pixels: number;
  description: string;
  usage: string[];
}

@Component({
  selector: 'ms-ms-spacing-tokens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-spacing-tokens.html',
  styleUrls: ['./ms-spacing-tokens.scss']
})
export class MsSpacingTokens {
  
  // Make Math available in template
  Math = Math;
  
  spacingTokens: SpacingToken[] = [
    {
      name: 'spacer-0',
      token: '--spacing-0',
      value: '0rem',
      pixels: 0,
      description: 'No spacing',
      usage: ['Resets', 'Zero margins/padding']
    },
    {
      name: 'spacer-25',
      token: '--spacing-1',
      value: '0.25rem',
      pixels: 4,
      description: 'Tiny spacing',
      usage: ['Icon gaps', 'Fine adjustments']
    },
    {
      name: 'spacer-50',
      token: '--spacing-2',
      value: '0.5rem',
      pixels: 8,
      description: 'Extra small spacing',
      usage: ['Small gaps', 'Compact layouts']
    },
    {
      name: 'spacer-75',
      token: '--spacing-3',
      value: '0.75rem',
      pixels: 12,
      description: 'Small spacing',
      usage: ['Form elements', 'Button padding']
    },
    {
      name: 'spacer-100',
      token: '--spacing-4',
      value: '1rem',
      pixels: 16,
      description: 'Base spacing unit',
      usage: ['Standard gaps', 'Component spacing']
    },
    {
      name: 'spacer-150',
      token: '--spacing-5',
      value: '1.5rem',
      pixels: 24,
      description: 'Medium spacing',
      usage: ['Section padding', 'Card spacing']
    },
    {
      name: 'spacer-200',
      token: '--spacing-6',
      value: '2rem',
      pixels: 32,
      description: 'Large spacing',
      usage: ['Layout sections', 'Major spacing']
    },
    {
      name: 'spacer-250',
      token: '--spacing-7',
      value: '2.5rem',
      pixels: 40,
      description: 'Extra large spacing',
      usage: ['Page sections', 'Hero spacing']
    },
    {
      name: 'spacer-300',
      token: '--spacing-8',
      value: '3rem',
      pixels: 48,
      description: 'XXL spacing',
      usage: ['Major sections', 'Page layout']
    },
    {
      name: 'spacer-400',
      token: '--spacing-10',
      value: '4rem',
      pixels: 64,
      description: 'Huge spacing',
      usage: ['Page headers', 'Major breaks']
    },
    {
      name: 'spacer-500',
      token: '--spacing-12',
      value: '5rem',
      pixels: 80,
      description: 'Massive spacing',
      usage: ['Page sections', 'Large breaks']
    },
    {
      name: 'spacer-600',
      token: '--spacing-16',
      value: '6rem',
      pixels: 96,
      description: 'Enormous spacing',
      usage: ['Page layout', 'Major sections']
    }
  ];

  // Track by function for ngFor performance
  trackByToken(index: number, token: SpacingToken): string {
    return token.name;
  }

  // Get formatted pixel display
  getPixelDisplay(pixels: number): string {
    if (pixels === 0) return '0 px';
    if (pixels === 16) return '16 px / 1 rem';
    return `${pixels} px`;
  }

  // Get usage examples as string
  getUsageString(usage: string[]): string {
    return usage.join(', ');
  }

  // Copy token to clipboard
  copyToken(token: string): void {
    navigator.clipboard.writeText(`var(${token})`).then(() => {
      console.log('Token copied to clipboard:', `var(${token})`);
    });
  }
}

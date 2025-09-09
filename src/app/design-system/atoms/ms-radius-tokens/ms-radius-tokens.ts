import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RadiusToken {
  name: string;
  token: string;
  value: string;
  pixels: number;
  description: string;
  usage: string[];
  category: 'subtle' | 'standard' | 'prominent';
}

@Component({
  selector: 'ms-radius-tokens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-radius-tokens.html',
  styleUrls: ['./ms-radius-tokens.scss']
})
export class MsRadiusTokens {
  
  // Make Math available in template
  Math = Math;
  
  radiusTokens: RadiusToken[] = [
    {
      name: 'radius-0',
      token: '--radius-0',
      value: '0px',
      pixels: 0,
      description: 'No radius',
      usage: ['Sharp corners', 'Modern layouts', 'Grid systems'],
      category: 'subtle'
    },
    {
      name: 'radius-2',
      token: '--radius-2',
      value: '2px',
      pixels: 2,
      description: 'Subtle radius',
      usage: ['Input fields', 'Dropdown lists', 'Form controls'],
      category: 'subtle'
    },
    {
      name: 'radius-4',
      token: '--radius-4',
      value: '4px',
      pixels: 4,
      description: 'Standard radius',
      usage: ['Buttons', 'Small components', 'Badges'],
      category: 'standard'
    },
    {
      name: 'radius-6',
      token: '--radius-6',
      value: '6px',
      pixels: 6,
      description: 'Medium radius',
      usage: ['Panels', 'Tooltips', 'Small cards'],
      category: 'standard'
    },
    {
      name: 'radius-8',
      token: '--radius-8',
      value: '8px',
      pixels: 8,
      description: 'Large radius',
      usage: ['Cards', 'Images', 'Content blocks'],
      category: 'prominent'
    },
    {
      name: 'radius-12',
      token: '--radius-12',
      value: '12px',
      pixels: 12,
      description: 'Extra large radius',
      usage: ['Large cards', 'Modals', 'Hero sections'],
      category: 'prominent'
    },
    {
      name: 'radius-16',
      token: '--radius-16',
      value: '16px',
      pixels: 16,
      description: 'Rounded',
      usage: ['Avatar containers', 'Feature cards', 'Callouts'],
      category: 'prominent'
    },
    {
      name: 'radius-24',
      token: '--radius-24',
      value: '24px',
      pixels: 24,
      description: 'Very rounded',
      usage: ['Large avatars', 'Decorative elements', 'Pills'],
      category: 'prominent'
    },
    {
      name: 'radius-full',
      token: '--radius-full',
      value: '9999px',
      pixels: 9999,
      description: 'Fully rounded',
      usage: ['Circular avatars', 'Pills', 'Floating buttons'],
      category: 'prominent'
    }
  ];

  getPixelDisplay(pixels: number): string {
    if (pixels === 9999) return 'Full';
    return `${pixels}px`;
  }

  getUsageString(usage: string[]): string {
    return usage.join(', ');
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(`var(${token})`).then(() => {
      console.log(`Copied: var(${token})`);
    });
  }

  trackByToken(index: number, token: RadiusToken): string {
    return token.name;
  }

  getTokensByCategory(category: 'subtle' | 'standard' | 'prominent'): RadiusToken[] {
    return this.radiusTokens.filter(token => token.category === category);
  }
} 
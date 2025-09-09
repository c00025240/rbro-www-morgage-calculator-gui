import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColorToken {
  name: string;
  variable: string;
  value: string;
  fallbackValue: string;
  description: string;
  category: string;
}

@Component({
  selector: 'ms-ms-color-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-color-palette.html',
  styleUrl: './ms-color-palette.scss'
})
export class MsColorPalette implements OnInit {
  colorTokens: ColorToken[] = [];

  ngOnInit() {
    this.loadColorTokens();
  }

  private loadColorTokens() {
    // Get computed styles to read the actual CSS custom property values
    const computedStyle = getComputedStyle(document.documentElement);

    this.colorTokens = [
      // BRAND COLORS
      {
        name: 'Brand Digi Yellow',
        variable: '--rbro-yellow-primary',
        value: this.getColorValue(computedStyle, '--rbro-yellow-primary'),
        fallbackValue: '#fee600',
        description: 'Primary Raiffeisen brand color',
        category: 'brand'
      },
      {
        name: 'Brand Off Black',
        variable: '--rbro-off-black',
        value: this.getColorValue(computedStyle, '--rbro-off-black'),
        fallbackValue: '#2b2d33',
        description: 'Primary dark brand color',
        category: 'brand'
      },
      {
        name: 'Brand White',
        variable: '--rbro-white',
        value: this.getColorValue(computedStyle, '--rbro-white'),
        fallbackValue: '#ffffff',
        description: 'Primary light brand color',
        category: 'brand'
      },

      // ACCENT COLORS
      {
        name: 'Accent Dark',
        variable: '--accent-dark',
        value: this.getColorValue(computedStyle, '--accent-dark'),
        fallbackValue: '#004454',
        description: 'Dark accent for high contrast',
        category: 'accent'
      },
      {
        name: 'Accent Default',
        variable: '--accent-default',
        value: this.getColorValue(computedStyle, '--accent-default'),
        fallbackValue: '#037080',
        description: 'Primary accent color',
        category: 'accent'
      },
      {
        name: 'Accent 60%',
        variable: '--accent-60',
        value: this.getColorValue(computedStyle, '--accent-60'),
        fallbackValue: '#68a9b3',
        description: '60% opacity accent',
        category: 'accent'
      },
      {
        name: 'Accent 30%',
        variable: '--accent-30',
        value: this.getColorValue(computedStyle, '--accent-30'),
        fallbackValue: '#b3d4d8',
        description: '30% opacity accent',
        category: 'accent'
      },
      {
        name: 'Accent 20%',
        variable: '--accent-20',
        value: this.getColorValue(computedStyle, '--accent-20'),
        fallbackValue: '#e5f0f2',
        description: '20% opacity accent',
        category: 'accent'
      },

      // ERROR COLORS (RED)
      {
        name: 'Error Dark',
        variable: '--error-dark',
        value: this.getColorValue(computedStyle, '--error-dark'),
        fallbackValue: '#cf030a',
        description: 'Dark error state',
        category: 'error'
      },
      {
        name: 'Error Default',
        variable: '--error-default',
        value: this.getColorValue(computedStyle, '--error-default'),
        fallbackValue: '#e61e33',
        description: 'Primary error color',
        category: 'error'
      },
      {
        name: 'Error 60%',
        variable: '--error-60',
        value: this.getColorValue(computedStyle, '--error-60'),
        fallbackValue: '#f07885',
        description: '60% opacity error',
        category: 'error'
      },
      {
        name: 'Error 30%',
        variable: '--error-30',
        value: this.getColorValue(computedStyle, '--error-30'),
        fallbackValue: '#f7bbc1',
        description: '30% opacity error',
        category: 'error'
      },
      {
        name: 'Error 10%',
        variable: '--error-10',
        value: this.getColorValue(computedStyle, '--error-10'),
        fallbackValue: '#fce8ea',
        description: '10% opacity error',
        category: 'error'
      },

      // WARNING COLORS (ORANGE)
      {
        name: 'Warning Dark',
        variable: '--warning-dark',
        value: this.getColorValue(computedStyle, '--warning-dark'),
        fallbackValue: '#ff1e03',
        description: 'Dark warning state',
        category: 'warning'
      },
      {
        name: 'Warning Default',
        variable: '--warning-default',
        value: this.getColorValue(computedStyle, '--warning-default'),
        fallbackValue: '#ff581e',
        description: 'Primary warning color',
        category: 'warning'
      },
      {
        name: 'Warning 60%',
        variable: '--warning-60',
        value: this.getColorValue(computedStyle, '--warning-60'),
        fallbackValue: '#ff9b78',
        description: '60% opacity warning',
        category: 'warning'
      },
      {
        name: 'Warning 30%',
        variable: '--warning-30',
        value: this.getColorValue(computedStyle, '--warning-30'),
        fallbackValue: '#ffccbb',
        description: '30% opacity warning',
        category: 'warning'
      },
      {
        name: 'Warning 10%',
        variable: '--warning-10',
        value: this.getColorValue(computedStyle, '--warning-10'),
        fallbackValue: '#ffeee8',
        description: '10% opacity warning',
        category: 'warning'
      },

      // SUCCESS COLORS (GREEN)
      {
        name: 'Success Dark',
        variable: '--success-dark',
        value: this.getColorValue(computedStyle, '--success-dark'),
        fallbackValue: '#0b7d3e',
        description: 'Dark success state',
        category: 'success'
      },
      {
        name: 'Success Default',
        variable: '--success-default',
        value: this.getColorValue(computedStyle, '--success-default'),
        fallbackValue: '#35b37e',
        description: 'Primary success color',
        category: 'success'
      },
      {
        name: 'Success 60%',
        variable: '--success-60',
        value: this.getColorValue(computedStyle, '--success-60'),
        fallbackValue: '#86d1b2',
        description: '60% opacity success',
        category: 'success'
      },
      {
        name: 'Success 30%',
        variable: '--success-30',
        value: this.getColorValue(computedStyle, '--success-30'),
        fallbackValue: '#c2e8d8',
        description: '30% opacity success',
        category: 'success'
      },
      {
        name: 'Success 10%',
        variable: '--success-10',
        value: this.getColorValue(computedStyle, '--success-10'),
        fallbackValue: '#eaf7f2',
        description: '10% opacity success',
        category: 'success'
      },

      // INFO COLORS (BLUE)
      {
        name: 'Info Dark',
        variable: '--info-dark',
        value: this.getColorValue(computedStyle, '--info-dark'),
        fallbackValue: '#0093ff',
        description: 'Dark info state',
        category: 'info'
      },
      {
        name: 'Info Default',
        variable: '--info-default',
        value: this.getColorValue(computedStyle, '--info-default'),
        fallbackValue: '#00c2ff',
        description: 'Primary info color',
        category: 'info'
      },
      {
        name: 'Info 60%',
        variable: '--info-60',
        value: this.getColorValue(computedStyle, '--info-60'),
        fallbackValue: '#7fe0ff',
        description: '60% opacity info',
        category: 'info'
      },
      {
        name: 'Info 30%',
        variable: '--info-30',
        value: this.getColorValue(computedStyle, '--info-30'),
        fallbackValue: '#b2ecff',
        description: '30% opacity info',
        category: 'info'
      },
      {
        name: 'Info 10%',
        variable: '--info-10',
        value: this.getColorValue(computedStyle, '--info-10'),
        fallbackValue: '#e5f8ff',
        description: '10% opacity info',
        category: 'info'
      },

      // SURFACE DEFAULT COLORS (All primary/default colors)
      {
        name: 'Surface White',
        variable: '--surface-white',
        value: this.getColorValue(computedStyle, '--surface-white'),
        fallbackValue: '#ffffff',
        description: 'Primary white surface',
        category: 'surface-default'
      },
      {
        name: 'Surface Warm Grey',
        variable: '--surface-warm-grey',
        value: this.getColorValue(computedStyle, '--surface-warm-grey'),
        fallbackValue: '#f1ede6',
        description: 'Warm grey surface',
        category: 'surface-default'
      },
      {
        name: 'Surface Warm Grey 50%',
        variable: '--surface-warm-grey-50',
        value: this.getColorValue(computedStyle, '--surface-warm-grey-50'),
        fallbackValue: '#f8f6f2',
        description: 'Light warm grey surface',
        category: 'surface-default'
      },
      {
        name: 'Surface Grey',
        variable: '--surface-grey',
        value: this.getColorValue(computedStyle, '--surface-grey'),
        fallbackValue: '#f4f4f4',
        description: 'Standard grey surface',
        category: 'surface-default'
      },
      {
        name: 'Surface Disabled',
        variable: '--surface-disabled',
        value: this.getColorValue(computedStyle, '--surface-disabled'),
        fallbackValue: '#d5d5d6',
        description: 'Disabled state surface',
        category: 'surface-default'
      },
      
      // Primary Backgrounds (part of Surface Default)
      {
        name: 'Background Primary',
        variable: '--bg-primary',
        value: this.getColorValue(computedStyle, '--bg-primary'),
        fallbackValue: '#fee600',
        description: 'Primary background (yellow)',
        category: 'surface-default'
      },
      {
        name: 'Background Primary Hover',
        variable: '--bg-primary-hover',
        value: this.getColorValue(computedStyle, '--bg-primary-hover'),
        fallbackValue: '#e5d119',
        description: 'Primary background hover state',
        category: 'surface-default'
      },
      {
        name: 'Background White',
        variable: '--bg-white',
        value: this.getColorValue(computedStyle, '--bg-white'),
        fallbackValue: '#ffffff',
        description: 'White background',
        category: 'surface-default'
      },
      {
        name: 'Background Black',
        variable: '--bg-black',
        value: this.getColorValue(computedStyle, '--bg-black'),
        fallbackValue: '#2b2d33',
        description: 'Black background',
        category: 'surface-default'
      },
      {
        name: 'Background Grey',
        variable: '--bg-grey',
        value: this.getColorValue(computedStyle, '--bg-grey'),
        fallbackValue: '#f4f4f4',
        description: 'Grey background',
        category: 'surface-default'
      },
      {
        name: 'Background Grey Secondary',
        variable: '--bg-grey-secondary',
        value: this.getColorValue(computedStyle, '--bg-grey-secondary'),
        fallbackValue: '#808185',
        description: 'Secondary grey background',
        category: 'surface-default'
      },
      {
        name: 'Background Disabled',
        variable: '--bg-disabled',
        value: this.getColorValue(computedStyle, '--bg-disabled'),
        fallbackValue: '#d5d5d6',
        description: 'Disabled background',
        category: 'surface-default'
      },
      {
        name: 'Background Accent',
        variable: '--bg-accent',
        value: this.getColorValue(computedStyle, '--bg-accent'),
        fallbackValue: '#037080',
        description: 'Accent background',
        category: 'surface-default'
      },
      {
        name: 'Background Accent 60%',
        variable: '--bg-accent-60',
        value: this.getColorValue(computedStyle, '--bg-accent-60'),
        fallbackValue: '#68a9b3',
        description: 'Accent background 60%',
        category: 'surface-default'
      },
      {
        name: 'Background Accent 30%',
        variable: '--bg-accent-30',
        value: this.getColorValue(computedStyle, '--bg-accent-30'),
        fallbackValue: '#b3d4d8',
        description: 'Accent background 30%',
        category: 'surface-default'
      },
      {
        name: 'Background Accent 20%',
        variable: '--bg-accent-20',
        value: this.getColorValue(computedStyle, '--bg-accent-20'),
        fallbackValue: '#e5f0f2',
        description: 'Accent background 20%',
        category: 'surface-default'
      },
      {
        name: 'Background Success',
        variable: '--bg-success',
        value: this.getColorValue(computedStyle, '--bg-success'),
        fallbackValue: '#0b7d3e',
        description: 'Success background',
        category: 'surface-default'
      },
      {
        name: 'Background Error',
        variable: '--bg-error',
        value: this.getColorValue(computedStyle, '--bg-error'),
        fallbackValue: '#e61e33',
        description: 'Error background',
        category: 'surface-default'
      },
      {
        name: 'Background Warning',
        variable: '--bg-warning',
        value: this.getColorValue(computedStyle, '--bg-warning'),
        fallbackValue: '#ff581e',
        description: 'Warning background',
        category: 'surface-default'
      },
      {
        name: 'Background Info',
        variable: '--bg-info',
        value: this.getColorValue(computedStyle, '--bg-info'),
        fallbackValue: '#0093ff',
        description: 'Info background',
        category: 'surface-default'
      },
      {
        name: 'Background Low Emphasis',
        variable: '--bg-low-emphasis',
        value: this.getColorValue(computedStyle, '--bg-low-emphasis'),
        fallbackValue: '#2b2d33',
        description: 'Low emphasis background',
        category: 'surface-default'
      },

      // Primary Text Colors (part of Surface Default)
      {
        name: 'Text Default',
        variable: '--text-default',
        value: this.getColorValue(computedStyle, '--text-default'),
        fallbackValue: '#2b2d33',
        description: 'Primary text color',
        category: 'surface-default'
      },
      {
        name: 'Text Secondary',
        variable: '--text-secondary',
        value: this.getColorValue(computedStyle, '--text-secondary'),
        fallbackValue: '#55575c',
        description: 'Secondary text color',
        category: 'surface-default'
      },
      {
        name: 'Text Accent',
        variable: '--text-accent',
        value: this.getColorValue(computedStyle, '--text-accent'),
        fallbackValue: '#037080',
        description: 'Accent text color',
        category: 'surface-default'
      },
      {
        name: 'Text Accent Secondary',
        variable: '--text-accent-secondary',
        value: this.getColorValue(computedStyle, '--text-accent-secondary'),
        fallbackValue: '#68a9b3',
        description: 'Secondary accent text',
        category: 'surface-default'
      },
      {
        name: 'Text Disabled',
        variable: '--text-disabled',
        value: this.getColorValue(computedStyle, '--text-disabled'),
        fallbackValue: '#aaabad',
        description: 'Disabled text color',
        category: 'surface-default'
      },
      {
        name: 'Text Grey',
        variable: '--text-grey',
        value: this.getColorValue(computedStyle, '--text-grey'),
        fallbackValue: '#e9eaea',
        description: 'Grey text variant',
        category: 'surface-default'
      },
      {
        name: 'Text Invert',
        variable: '--text-invert',
        value: this.getColorValue(computedStyle, '--text-invert'),
        fallbackValue: '#ffffff',
        description: 'Inverted text (white)',
        category: 'surface-default'
      },
      {
        name: 'Text Success',
        variable: '--text-success',
        value: this.getColorValue(computedStyle, '--text-success'),
        fallbackValue: '#0b7d3e',
        description: 'Success text color',
        category: 'surface-default'
      },
      {
        name: 'Text Warning',
        variable: '--text-warning',
        value: this.getColorValue(computedStyle, '--text-warning'),
        fallbackValue: '#e54f1b',
        description: 'Warning text color',
        category: 'surface-default'
      },
      {
        name: 'Text Error',
        variable: '--text-error',
        value: this.getColorValue(computedStyle, '--text-error'),
        fallbackValue: '#cf030a',
        description: 'Error text color',
        category: 'surface-default'
      },
      {
        name: 'Text Info',
        variable: '--text-info',
        value: this.getColorValue(computedStyle, '--text-info'),
        fallbackValue: '#0076cc',
        description: 'Info text color',
        category: 'surface-default'
      },

      // BORDER COLORS
      {
        name: 'Border High Emphasis',
        variable: '--border-high-emphasis',
        value: this.getColorValue(computedStyle, '--border-high-emphasis'),
        fallbackValue: '#2b2d33',
        description: 'High emphasis borders',
        category: 'border'
      },
      {
        name: 'Border Medium Emphasis',
        variable: '--border-medium-emphasis',
        value: this.getColorValue(computedStyle, '--border-medium-emphasis'),
        fallbackValue: '#2b2d33',
        description: 'Medium emphasis borders',
        category: 'border'
      },
      {
        name: 'Border Low Emphasis',
        variable: '--border-low-emphasis',
        value: this.getColorValue(computedStyle, '--border-low-emphasis'),
        fallbackValue: '#2b2d33',
        description: 'Low emphasis borders',
        category: 'border'
      },

      // SURFACE LIGHT COLORS
      {
        name: 'Surface RBI Yellow',
        variable: '--surface-rbi-yellow',
        value: this.getColorValue(computedStyle, '--surface-rbi-yellow'),
        fallbackValue: '#fee600',
        description: 'Branded yellow surface',
        category: 'surface-light'
      },
      {
        name: 'Surface Yellow 1',
        variable: '--surface-yellow-1',
        value: this.getColorValue(computedStyle, '--surface-yellow-1'),
        fallbackValue: '#fff0a6',
        description: 'Light yellow surface variant',
        category: 'surface-light'
      },
      {
        name: 'Surface Yellow 2',
        variable: '--surface-yellow-2',
        value: this.getColorValue(computedStyle, '--surface-yellow-2'),
        fallbackValue: '#ffd403',
        description: 'Alternative yellow surface',
        category: 'surface-light'
      },
      {
        name: 'Surface Purple 1',
        variable: '--surface-purple-1',
        value: this.getColorValue(computedStyle, '--surface-purple-1'),
        fallbackValue: '#9d88d9',
        description: 'Light purple surface',
        category: 'surface-light'
      },

      // SURFACE DARK COLORS
      {
        name: 'Surface Off Black',
        variable: '--surface-off-black',
        value: this.getColorValue(computedStyle, '--surface-off-black'),
        fallbackValue: '#2b2d33',
        description: 'Dark surface variant',
        category: 'surface-dark'
      },
      {
        name: 'Surface Purple 2',
        variable: '--surface-purple-2',
        value: this.getColorValue(computedStyle, '--surface-purple-2'),
        fallbackValue: '#412f59',
        description: 'Dark purple surface',
        category: 'surface-dark'
      },
      {
        name: 'Surface Purple',
        variable: '--surface-purple',
        value: this.getColorValue(computedStyle, '--surface-purple'),
        fallbackValue: '#6a4cad',
        description: 'Medium purple surface',
        category: 'surface-dark'
      },

      // TEXT LIGHT COLORS
      {
        name: 'Text Light Default',
        variable: '--text-light-default',
        value: this.getColorValue(computedStyle, '--text-light-default'),
        fallbackValue: '#2b2d33',
        description: 'Default text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Accent',
        variable: '--text-light-accent',
        value: this.getColorValue(computedStyle, '--text-light-accent'),
        fallbackValue: '#55575c',
        description: 'Accent text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Secondary',
        variable: '--text-light-secondary',
        value: this.getColorValue(computedStyle, '--text-light-secondary'),
        fallbackValue: '#404247',
        description: 'Secondary text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Disabled',
        variable: '--text-light-disabled',
        value: this.getColorValue(computedStyle, '--text-light-disabled'),
        fallbackValue: '#808185',
        description: 'Disabled text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Success',
        variable: '--text-light-success',
        value: this.getColorValue(computedStyle, '--text-light-success'),
        fallbackValue: '#0b7d3e',
        description: 'Success text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Warning',
        variable: '--text-light-warning',
        value: this.getColorValue(computedStyle, '--text-light-warning'),
        fallbackValue: '#e54f1b',
        description: 'Warning text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Error',
        variable: '--text-light-error',
        value: this.getColorValue(computedStyle, '--text-light-error'),
        fallbackValue: '#cf030a',
        description: 'Error text for light surfaces',
        category: 'text-light'
      },
      {
        name: 'Text Light Info',
        variable: '--text-light-info',
        value: this.getColorValue(computedStyle, '--text-light-info'),
        fallbackValue: '#0076cc',
        description: 'Info text for light surfaces',
        category: 'text-light'
      },

      // TEXT DARK COLORS
      {
        name: 'Text Dark Default',
        variable: '--text-dark-default',
        value: this.getColorValue(computedStyle, '--text-dark-default'),
        fallbackValue: '#ffffff',
        description: 'Default text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Accent',
        variable: '--text-dark-accent',
        value: this.getColorValue(computedStyle, '--text-dark-accent'),
        fallbackValue: '#d5d5d6',
        description: 'Accent text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Secondary',
        variable: '--text-dark-secondary',
        value: this.getColorValue(computedStyle, '--text-dark-secondary'),
        fallbackValue: '#d5d5d6',
        description: 'Secondary text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Grey',
        variable: '--text-dark-grey',
        value: this.getColorValue(computedStyle, '--text-dark-grey'),
        fallbackValue: '#d5d5d6',
        description: 'Grey text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Disabled',
        variable: '--text-dark-disabled',
        value: this.getColorValue(computedStyle, '--text-dark-disabled'),
        fallbackValue: '#aaabad',
        description: 'Disabled text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Success',
        variable: '--text-dark-success',
        value: this.getColorValue(computedStyle, '--text-dark-success'),
        fallbackValue: '#c2e8d8',
        description: 'Success text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Error',
        variable: '--text-dark-error',
        value: this.getColorValue(computedStyle, '--text-dark-error'),
        fallbackValue: '#f7bbc1',
        description: 'Error text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Warning',
        variable: '--text-dark-warning',
        value: this.getColorValue(computedStyle, '--text-dark-warning'),
        fallbackValue: '#ffccbb',
        description: 'Warning text for dark surfaces',
        category: 'text-dark'
      },
      {
        name: 'Text Dark Info',
        variable: '--text-dark-info',
        value: this.getColorValue(computedStyle, '--text-dark-info'),
        fallbackValue: '#b2ecff',
        description: 'Info text for dark surfaces',
        category: 'text-dark'
      },

      // BACKGROUND LIGHT COLORS
      {
        name: 'Background Light Primary',
        variable: '--bg-light-primary',
        value: this.getColorValue(computedStyle, '--bg-light-primary'),
        fallbackValue: '#fee600',
        description: 'Light mode primary background',
        category: 'background-light'
      },
      {
        name: 'Background Light Accent',
        variable: '--bg-light-accent',
        value: this.getColorValue(computedStyle, '--bg-light-accent'),
        fallbackValue: '#037080',
        description: 'Light mode accent background',
        category: 'background-light'
      },
      {
        name: 'Background Light Success',
        variable: '--bg-light-success',
        value: this.getColorValue(computedStyle, '--bg-light-success'),
        fallbackValue: '#0b7d3e',
        description: 'Light mode success background',
        category: 'background-light'
      },
      {
        name: 'Background Light Warning',
        variable: '--bg-light-warning',
        value: this.getColorValue(computedStyle, '--bg-light-warning'),
        fallbackValue: '#ff581e',
        description: 'Light mode warning background',
        category: 'background-light'
      },
      {
        name: 'Background Light Error',
        variable: '--bg-light-error',
        value: this.getColorValue(computedStyle, '--bg-light-error'),
        fallbackValue: '#e61e33',
        description: 'Light mode error background',
        category: 'background-light'
      },
      {
        name: 'Background Light Info',
        variable: '--bg-light-info',
        value: this.getColorValue(computedStyle, '--bg-light-info'),
        fallbackValue: '#0093ff',
        description: 'Light mode info background',
        category: 'background-light'
      },
      {
        name: 'Background Light Low Emphasis',
        variable: '--bg-light-low-emphasis',
        value: this.getColorValue(computedStyle, '--bg-light-low-emphasis'),
        fallbackValue: '#2b2d33',
        description: 'Light mode low emphasis background',
        category: 'background-light'
      },

      // BACKGROUND DARK COLORS
      {
        name: 'Background Dark Black',
        variable: '--bg-dark-black',
        value: this.getColorValue(computedStyle, '--bg-dark-black'),
        fallbackValue: '#2b2d33',
        description: 'Dark mode black background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Primary',
        variable: '--bg-dark-primary',
        value: this.getColorValue(computedStyle, '--bg-dark-primary'),
        fallbackValue: '#fee600',
        description: 'Dark mode primary background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Accent',
        variable: '--bg-dark-accent',
        value: this.getColorValue(computedStyle, '--bg-dark-accent'),
        fallbackValue: '#d5d5d6',
        description: 'Dark mode accent background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Secondary',
        variable: '--background-dark-secondary',
        value: this.getColorValue(computedStyle, '--background-dark-secondary'),
        fallbackValue: '#44464B',
        description: 'Dark mode secondary background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Success',
        variable: '--bg-dark-success',
        value: this.getColorValue(computedStyle, '--bg-dark-success'),
        fallbackValue: '#c2e8d8',
        description: 'Dark mode success background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Warning',
        variable: '--bg-dark-warning',
        value: this.getColorValue(computedStyle, '--bg-dark-warning'),
        fallbackValue: '#ffccbb',
        description: 'Dark mode warning background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Error',
        variable: '--bg-dark-error',
        value: this.getColorValue(computedStyle, '--bg-dark-error'),
        fallbackValue: '#f7bbc1',
        description: 'Dark mode error background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Info',
        variable: '--bg-dark-info',
        value: this.getColorValue(computedStyle, '--bg-dark-info'),
        fallbackValue: '#b2ecff',
        description: 'Dark mode info background',
        category: 'background-dark'
      },
      {
        name: 'Background Dark Low Emphasis',
        variable: '--bg-dark-low-emphasis',
        value: this.getColorValue(computedStyle, '--bg-dark-low-emphasis'),
        fallbackValue: '#ffffff',
        description: 'Dark mode low emphasis background',
        category: 'background-dark'
      },

      // BORDER DARK COLORS
      {
        name: 'Border Dark High Emphasis',
        variable: '--border-dark-high-emphasis',
        value: this.getColorValue(computedStyle, '--border-dark-high-emphasis'),
        fallbackValue: '#ffffff',
        description: 'Dark mode high emphasis borders',
        category: 'border-dark'
      },
      {
        name: 'Border Dark Medium Emphasis',
        variable: '--border-dark-medium-emphasis',
        value: this.getColorValue(computedStyle, '--border-dark-medium-emphasis'),
        fallbackValue: '#ffffff',
        description: 'Dark mode medium emphasis borders',
        category: 'border-dark'
      },
      {
        name: 'Border Dark Low Emphasis',
        variable: '--border-dark-low-emphasis',
        value: this.getColorValue(computedStyle, '--border-dark-low-emphasis'),
        fallbackValue: '#ffffff',
        description: 'Dark mode low emphasis borders',
        category: 'border-dark'
      }
    ];
  }

  private getColorValue(computedStyle: CSSStyleDeclaration, variable: string): string {
    const value = computedStyle.getPropertyValue(variable).trim();
    return value || 'Not available';
  }

  getDisplayColor(token: ColorToken): string {
    // Use the CSS variable if available, otherwise use fallback
    return token.value !== 'Not available' ? `var(${token.variable})` : token.fallbackValue;
  }

  getCategoryColors(category: string): ColorToken[] {
    return this.colorTokens.filter(token => token.category === category);
  }

  getCategories(): string[] {
    return [
      'brand', 
      'accent', 
      'error', 
      'warning', 
      'success', 
      'info', 
      'surface-default', 
      'surface-light', 
      'surface-dark',
      'text-light', 
      'text-dark',
      'background-light', 
      'background-dark',
      'border',
      'border-dark'
    ];
  }

  getCategoryTitle(category: string): string {
    const titles: { [key: string]: string } = {
      'brand': 'Brand Colors',
      'accent': 'Accent Colors (Teal)',
      'error': 'Error Colors (Red)',
      'warning': 'Warning Colors (Orange)', 
      'success': 'Success Colors (Green)',
      'info': 'Info Colors (Blue)',
      'surface-default': 'Surface Default',
      'surface-light': 'Surface Light',
      'surface-dark': 'Surface Dark',
      'text-light': 'Text Light',
      'text-dark': 'Text Dark',
      'background-light': 'Background Light',
      'background-dark': 'Background Dark',
      'border': 'Border Colors',
      'border-dark': 'Border Dark'
    };
    return titles[category] || category;
  }
}

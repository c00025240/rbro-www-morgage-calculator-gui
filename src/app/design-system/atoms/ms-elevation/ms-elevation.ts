import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ElevationLevel {
  name: string;
  level: string;
  cssClass: string;
  description: string;
  usage: string;
  shadowValue: string;
  useCase: string;
}

@Component({
  selector: 'ms-ms-elevation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-elevation.html',
  styleUrl: './ms-elevation.scss'
})
export class MsElevation implements OnInit {
  // Storybook Controls Inputs
  @Input() selectedElevation: string = 'small';
  @Input() showUsageExamples: boolean = true;
  @Input() showInteractiveStates: boolean = true;
  @Input() showCodeExamples: boolean = true;
  @Input() backgroundColor: string = '#f5f5f5';

  elevationLevels: ElevationLevel[] = [
    {
      name: 'Elevation Zero',
      level: 'zero',
      cssClass: 'elevation-zero',
      description: 'Flat surface with no shadow, used for elements that sit directly on the background',
      usage: 'Default state for cards, panels, and form elements',
      shadowValue: 'none',
      useCase: 'Form inputs, basic cards, dividers'
    },
    {
      name: 'Elevation Small', 
      level: 'small',
      cssClass: 'elevation-small',
      description: 'Subtle shadow creating minimal visual separation from the background',
      usage: 'Buttons, chips, and interactive elements in their default state',
      shadowValue: '0 2px 16px -4px rgba(0, 0, 0, 0.10)',
      useCase: 'Buttons, badges, tooltips, dropdowns'
    },
    {
      name: 'Elevation Medium',
      level: 'medium', 
      cssClass: 'elevation-medium',
      description: 'Moderate shadow for elements that need more prominence or are interactive',
      usage: 'Cards with content, modals, navigation menus, hover states',
      shadowValue: '0 0 16px -8px rgba(0, 0, 0, 0.08), 0 20px 32px -20px rgba(0, 0, 0, 0.12)',
      useCase: 'Content cards, sidebars, dropdowns, hover states'
    },
    {
      name: 'Elevation Large',
      level: 'large',
      cssClass: 'elevation-large', 
      description: 'Strong shadow for high-priority elements and overlays',
      usage: 'Modals, popovers, floating action buttons, high-priority notifications',
      shadowValue: '0 0 32px -12px rgba(0, 0, 0, 0.16), 0 40px 72px -24px rgba(0, 0, 0, 0.20)',
      useCase: 'Modals, overlays, floating elements, notifications'
    }
  ];

  mortgageExamples = [
    {
      title: 'Loan Application Card',
      elevation: 'medium',
      description: 'Main content card displaying loan details and application form'
    },
    {
      title: 'Calculate Button',
      elevation: 'small', 
      description: 'Primary action button with subtle elevation in default state'
    },
    {
      title: 'Rate Comparison Modal',
      elevation: 'large',
      description: 'Overlay modal showing detailed rate comparisons and terms'
    },
    {
      title: 'Input Fields',
      elevation: 'zero',
      description: 'Form inputs for loan amount, term, and personal information'
    },
    {
      title: 'Success Notification',
      elevation: 'large',
      description: 'High-priority notification confirming successful application submission'
    }
  ];

  ngOnInit() {
    // Component initialization
  }

  getElevationByLevel(level: string): ElevationLevel | undefined {
    return this.elevationLevels.find(el => el.level === level);
  }

  isSelectedElevation(level: string): boolean {
    return this.selectedElevation === level;
  }

  getDisplayStyle(): { [key: string]: string } {
    return {
      'background-color': this.backgroundColor
    };
  }
}

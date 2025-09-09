# SimulatorOptionModal

A specialized modal component for simulator option selection, built on top of the `ms-modal` component.

## Overview

The `SimulatorOptionModal` displays a modal with three predefined loan simulation options that users can choose from. It provides a clean interface for selecting the type of loan simulation the user wants to perform.

## Features

- **Modal-based interface**: Uses the existing `ms-modal` as a foundation
- **Option selection**: Displays 3 predefined options with single selection
- **Default selection**: First option is selected by default
- **Event emission**: Emits events for modal close and option selection
- **Surface support**: Supports both light and dark surface themes
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Inherits accessibility features from `ms-modal`
- **Keyboard support**: Supports Escape key to close modal

## Default Options

1. **achizitie imobil** (selected by default) - Property acquisition
2. **refinantare** - Refinancing
3. **constructie/renovare sau investitie** - Construction/renovation or investment

## Usage

### Basic Implementation

```typescript
import { Component } from '@angular/core';
import { SimulatorOptionModal } from '@design-system/organisms/simulator-option-modal';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SimulatorOptionModal],
  template: `
    <simulator-option-modal
      [isVisible]="isModalVisible"
      [surface]="'light'"
      (closeModal)="onModalClose()"
      (optionSelected)="onOptionSelected($event)">
    </simulator-option-modal>
  `
})
export class ExampleComponent {
  isModalVisible = false;

  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  onOptionSelected(optionId: string) {
    console.log('Selected option:', optionId);
    // Handle option selection logic here
    this.isModalVisible = false; // Optionally close modal after selection
  }
}
```

### With Dark Theme

```typescript
@Component({
  template: `
    <simulator-option-modal
      [isVisible]="isModalVisible"
      [surface]="'dark'"
      (closeModal)="onModalClose()"
      (optionSelected)="onOptionSelected($event)">
    </simulator-option-modal>
  `
})
export class DarkThemeExample {
  // ... component logic
}
```

## Props

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isVisible` | `boolean` | `false` | Controls the visibility of the modal |
| `surface` | `'light' \| 'dark'` | `'light'` | Surface theme for the modal |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `closeModal` | `EventEmitter<void>` | Emitted when the modal is closed (backdrop click, close button, or Escape key) |
| `optionSelected` | `EventEmitter<string>` | Emitted when an option is selected, returns the option ID |

## Option IDs

The component emits the following option IDs when selected:

- `'achizitie-imobil'` - Property acquisition option
- `'refinantare'` - Refinancing option  
- `'constructie-renovare'` - Construction/renovation or investment option

## Interface

```typescript
export interface SimulatorOption {
  id: string;
  label: string;
  selected: boolean;
}
```

## Methods

### Public Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getSelectedOption()` | `SimulatorOption \| undefined` | Returns the currently selected option |

## Styling

The component uses CSS custom properties for theming and follows the design system tokens. The modal automatically adapts to different screen sizes:

- **Mobile/Tablet**: Modal slides up from bottom
- **Desktop**: Modal appears centered on screen

## Accessibility

- **ARIA attributes**: Proper `role`, `aria-modal`, and `aria-labelledby` attributes
- **Keyboard navigation**: Escape key closes the modal
- **Focus management**: Inherits focus behavior from `ms-modal`
- **Screen reader support**: Proper labeling for all interactive elements

## Dependencies

This component depends on:

- `@angular/core`
- `@angular/common`
- `ms-modal` (parent modal component)
- `ms-option-cell` (for option display)

## Examples

### Complete Integration Example

```typescript
import { Component, signal } from '@angular/core';
import { SimulatorOptionModal, SimulatorOption } from '@design-system/organisms/simulator-option-modal';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [SimulatorOptionModal],
  template: `
    <div class="simulator-container">
      <button (click)="showModal()" class="open-modal-btn">
        Choose Simulation Type
      </button>
      
      <simulator-option-modal
        [isVisible]="modalVisible()"
        [surface]="currentTheme()"
        (closeModal)="hideModal()"
        (optionSelected)="handleOptionSelection($event)">
      </simulator-option-modal>
      
      <div *ngIf="selectedOption()" class="selection-display">
        <h3>Selected Option:</h3>
        <p>{{ selectedOption()?.label }}</p>
      </div>
    </div>
  `
})
export class SimulatorComponent {
  modalVisible = signal(false);
  currentTheme = signal<'light' | 'dark'>('light');
  selectedOption = signal<SimulatorOption | undefined>(undefined);

  showModal() {
    this.modalVisible.set(true);
  }

  hideModal() {
    this.modalVisible.set(false);
  }

  handleOptionSelection(optionId: string) {
    // You can access the selected option details if needed
    console.log('User selected:', optionId);
    
    // Close modal after selection
    this.hideModal();
    
    // Proceed with simulation based on selected option
    this.startSimulation(optionId);
  }

  private startSimulation(optionId: string) {
    // Implement simulation logic based on selected option
    switch (optionId) {
      case 'achizitie-imobil':
        // Handle property acquisition simulation
        break;
      case 'refinantare':
        // Handle refinancing simulation
        break;
      case 'constructie-renovare':
        // Handle construction/renovation simulation
        break;
    }
  }

  toggleTheme() {
    this.currentTheme.set(this.currentTheme() === 'light' ? 'dark' : 'light');
  }
}
```

## Testing

The component includes comprehensive unit tests covering:

- Component creation
- Default option state
- Option selection behavior
- Event emission
- Modal close functionality

Run tests with:
```bash
npm test
```

## Storybook

View the component in Storybook:
```bash
npm run storybook
```

Navigate to `Design System → Organisms → SimulatorOptionModal` to see all variations and interact with the component. 
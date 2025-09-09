import { Component, Input, Output, EventEmitter, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ms-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-toggle.html',
  styleUrls: ['./ms-toggle.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsToggle {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedby: string = '';

  @Output() change = new EventEmitter<{ checked: boolean }>();

  private isPressed = signal<boolean>(false);
  private isFocused = signal<boolean>(false);

  onToggleChange() {
    if (this.disabled) return;
    
    this.checked = !this.checked;
    this.change.emit({ checked: this.checked });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onToggleChange();
    }
  }

  onMouseDown() {
    if (!this.disabled) {
      this.isPressed.set(true);
    }
  }

  onMouseUp() {
    this.isPressed.set(false);
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
    this.isPressed.set(false);
  }

  getSwitchClasses(): string[] {
    const classes = [
      'ms-toggle',
      `ms-toggle--surface-${this.surface}`
    ];

    if (this.checked) {
      classes.push('ms-toggle--checked');
    }

    if (this.disabled) {
      classes.push('ms-toggle--disabled');
    }

    if (this.isPressed()) {
      classes.push('ms-toggle--pressed');
    }

    if (this.isFocused()) {
      classes.push('ms-toggle--focused');
    }

    return classes;
  }

  getSwitchRole(): string {
    return 'switch';
  }

  getSwitchAriaChecked(): string {
    return this.checked.toString();
  }

  getSwitchAriaDisabled(): string | null {
    return this.disabled ? 'true' : null;
  }
}

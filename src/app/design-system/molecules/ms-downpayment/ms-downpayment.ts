import { Component, Input, ChangeDetectionStrategy, signal, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsTextFieldCustomComponent } from '../../atoms/ms-text-field-custom/ms-text-field-custom';
import { MsCard } from '../ms-card/ms-card';
import { MsCardOutsideTitleComponent } from '../ms-card-outside-title/ms-card-outside-title';

@Component({
  selector: 'ms-downpayment',
  standalone: true,
  imports: [CommonModule, MsTextFieldCustomComponent, MsCard, MsCardOutsideTitleComponent],
  templateUrl: './ms-downpayment.html',
  styleUrls: ['./ms-downpayment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MsDownpaymentComponent implements OnChanges {
  constructor(private cdr: ChangeDetectorRef) {}
  @Input() label: string = 'Avans';
  @Input() helperText: string = 'Introduceți avansul pe care doriți să îl plătiți';
  @Input() infoNote?: string; // Note about additional amount needed for discount
  @Input() infoNoteType?: 'info' | 'success'; // Type of info note for styling
  @Input() currency: string = 'Lei';
  @Input() min: number = 0;
  @Input() max: number = 500000;
  @Input() step: number = 1000;
  // External bindings
  @Input() valueProp?: number;
  @Input() disabledProp?: boolean;
  // Validation
  @Input() error?: boolean; // Error state for validation
  @Input() errorMessage?: string; // Error message to display

  @Output() valueChange = new EventEmitter<number>();

  value = signal<string>('');
  currentValue = signal<number>(0);
  // Never disabled - always allow user input
  disabled = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valueProp']) {
      const v = changes['valueProp'].currentValue;
      if (v !== undefined && v !== null && !Number.isNaN(v)) {
        const rounded = Math.round(v);
        this.value.set(String(rounded));
        this.currentValue.set(rounded);
      }
    }
    // Ignore disabledProp - this component should never be disabled
    // Users should always be able to input the down payment amount
  }

  get progressPercentage(): number {
    const value = this.currentValue();
    const clamped = Math.min(Math.max(value, this.min), this.max);
    const raw = ((clamped - this.min) / (this.max - this.min)) * 100;
    const minPercentage = 2;
    const maxPercentage = 98;
    return minPercentage + (raw * (maxPercentage - minPercentage) / 100);
  }

  onValueChange(next: string): void {
    this.value.set(next);
    const numeric = Number(next);
    // Never disable the input - always allow user to type
    if (!Number.isNaN(numeric)) {
      const rounded = Math.round(numeric);
      this.currentValue.set(rounded);
      this.valueChange.emit(rounded);
      this.cdr.markForCheck();
    }
  }

  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const numeric = Number(target.value);
    if (!Number.isNaN(numeric)) {
      const rounded = Math.round(numeric);
      this.currentValue.set(rounded);
      this.value.set(String(rounded));
      this.valueChange.emit(rounded);
      this.cdr.markForCheck();
    }
  }

  onSliderTouchStart(event: TouchEvent): void { event.stopPropagation(); }
  onSliderTouchMove(event: TouchEvent): void { event.stopPropagation(); }
  onSliderInputTouchStart(event: TouchEvent): void { event.stopPropagation(); }
  onSliderInputTouchMove(event: TouchEvent): void { event.stopPropagation(); }
}



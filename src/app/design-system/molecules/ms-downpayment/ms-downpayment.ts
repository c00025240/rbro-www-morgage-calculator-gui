import { Component, Input, ChangeDetectionStrategy, signal, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() label: string = 'Avans';
  @Input() helperText: string = 'Introduceți avansul pe care doriți să îl plătiți';
  @Input() currency: string = 'RON';
  // External bindings
  @Input() valueProp?: number;
  @Input() disabledProp?: boolean;

  @Output() valueChange = new EventEmitter<number>();

  value = signal<string>('');
  // Disabled by default so undefined/empty is treated as disabled
  disabled = signal<boolean>(true);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valueProp']) {
      const v = changes['valueProp'].currentValue;
      if (v !== undefined && v !== null && !Number.isNaN(v)) {
        this.value.set(String(v));
      }
    }
    if (changes['disabledProp']) {
      const d = changes['disabledProp'].currentValue;
      if (typeof d === 'boolean') {
        this.disabled.set(d);
      }
    }
  }

  onValueChange(next: string): void {
    this.value.set(next);
    const numeric = Number(next);
    const shouldDisable = next.trim() === '' || Number.isNaN(numeric) || numeric <= 0;
    this.disabled.set(shouldDisable);
    if (!Number.isNaN(numeric)) {
      this.valueChange.emit(numeric);
    }
  }
}



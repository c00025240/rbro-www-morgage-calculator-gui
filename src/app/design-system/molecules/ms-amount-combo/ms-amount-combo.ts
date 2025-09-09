import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MsAmountValue } from '../../atoms/ms-amount-value/ms-amount-value';

export interface AmountData {
	label: string;
	amount: string;
	currency: string;
}

@Component({
	selector: 'ms-amount-combo',
	standalone: true,
	imports: [CommonModule, MsAmountValue],
	templateUrl: './ms-amount-combo.html',
	styleUrls: ['./ms-amount-combo.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsAmountCombo {
	/** Left amount data */
	@Input() leftAmount?: AmountData;
	
	/** Right amount data */
	@Input() rightAmount?: AmountData;
	
	/** Additional CSS class for custom styling */
	@Input() cssClass?: string;
} 
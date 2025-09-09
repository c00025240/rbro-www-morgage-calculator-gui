import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'ms-amount-value',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ms-amount-value.html',
	styleUrls: ['./ms-amount-value.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsAmountValue {
	/** Label text displayed above the amount */
	@Input() label: string = '';
	
	/** Amount value to display */
	@Input() amount: string = '';
	
	/** Currency or unit text (e.g., "RON/luna") */
	@Input() currency: string = '';
	
	/** Additional CSS class for custom styling */
	@Input() cssClass?: string;
} 
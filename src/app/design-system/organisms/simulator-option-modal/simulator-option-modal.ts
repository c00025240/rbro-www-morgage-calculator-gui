import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsModal } from '../ms-modal/ms-modal';
import { MsOptionCell } from '../../molecules/ms-option-cell/ms-option-cell';

export interface SimulatorOption {
  id: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'simulator-option-modal',
  standalone: true,
  imports: [CommonModule, MsModal, MsOptionCell],
  templateUrl: './simulator-option-modal.html',
  styleUrls: ['./simulator-option-modal.scss']
})
export class SimulatorOptionModal implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() surface: 'light' | 'dark' = 'light';
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<string>();

  // Default options based on requirements
  options = signal<SimulatorOption[]>([
    { id: 'achizitie-imobil', label: 'achiziție imobil', selected: true },
    { id: 'refinantare', label: 'refinanțare', selected: false },
    { id: 'constructie-renovare', label: 'construcție/renovare sau investiție', selected: false },
    { id: 'credit-venit', label: 'credit în funcție de venit', selected: false }
  ]);

  readonly modalTitle = 'Simulezi';

  ngOnInit() {
    // Component initialization if needed
  }

  onModalClose() {
    this.closeModal.emit();
  }

  onOptionClick(optionId: string) {
    // Update selected state - only one option can be selected at a time
    const updatedOptions = this.options().map(option => ({
      ...option,
      selected: option.id === optionId
    }));
    
    this.options.set(updatedOptions);
    
    // Emit the selected option
    this.optionSelected.emit(optionId);
  }

  getSelectedOption(): SimulatorOption | undefined {
    return this.options().find(option => option.selected);
  }
} 
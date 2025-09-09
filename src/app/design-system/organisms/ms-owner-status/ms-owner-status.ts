import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsCard } from '../../molecules/ms-card/ms-card';
import { MsCardOutsideTitleComponent } from '../../molecules/ms-card-outside-title/ms-card-outside-title';
import { MsSwitchForm } from '../../molecules/ms-switch-form/ms-switch-form';

@Component({
  selector: 'ms-owner-status',
  standalone: true,
  imports: [CommonModule, MsCard, MsCardOutsideTitleComponent, MsSwitchForm],
  template: `
    <div class="ms-owner-status">
      <ms-card-outside-title
        [title]="'Status locuinta'"
        [hasHelper]="true"
        [helperText]="'Aceasta informatie poate influenta eligibilitatea sau conditiile creditului.'">
      </ms-card-outside-title>

      <ms-card>
        <ms-switch-form 
          [surface]="surface"
          labelText="Detii sau ai detinut in trecut o locuinta?"
          switchLabel="Proprietar"
          [checked]="owner"
          [showInfoIcon]="true"
          infoTooltip="Selecteaza daca detii sau ai detinut o locuinta in trecut. Se mapeaza pe campul 'owner'."
          [disabled]="disabled"
          (change)="onOwnerToggle($event)">
        </ms-switch-form>
      </ms-card>
    </div>
  `,
  styleUrls: ['./ms-owner-status.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsOwnerStatusComponent {
  @Input() owner: boolean = false;
  @Input() disabled: boolean = false;
  @Input() surface: 'default' | 'light' | 'dark' = 'default';

  @Output() ownerChange = new EventEmitter<boolean>();

  onOwnerToggle(event: { checked: boolean }): void {
    this.ownerChange.emit(event.checked);
  }
}



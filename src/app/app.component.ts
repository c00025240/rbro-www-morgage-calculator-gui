import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsSimulatorPage } from './design-system/pages/ms-simulator-page/ms-simulator-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MsSimulatorPage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rbro-www-mortgage-calculator-gui';
}

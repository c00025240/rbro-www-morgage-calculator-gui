import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./design-system/pages/ms-simulator-page/ms-simulator-page').then(m => m.MsSimulatorPage)
  },
  {
    path: 'mock',
    loadComponent: () => import('./design-system/pages/mock-cost-breakdown/mock-cost-breakdown').then(m => m.MockCostBreakdownComponent)
  }
];

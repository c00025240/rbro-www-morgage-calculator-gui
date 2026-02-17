import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsWebSummaryCard } from '../../organisms/ms-web-summary-card/ms-web-summary-card';
import { MsMobileSummaryModalComponent } from '../../molecules/ms-mobile-summary-modal/ms-mobile-summary-modal';

@Component({
  selector: 'mock-cost-breakdown',
  standalone: true,
  imports: [CommonModule, MsWebSummaryCard, MsMobileSummaryModalComponent],
  template: `
    <div class="mock-page">
      <h1>Cost Breakdown Feature Demo</h1>
      <p class="mock-page__description">
        This page demonstrates the new features:<br>
        1. <strong>Cost Breakdown</strong>: Click "Sumar calcule" to expand, find "Valoarea totală plătibilă" and click "Vezi detalii costuri"<br>
        2. <strong>Download Schedule</strong>: In expanded view, find the "Descarcă scadențar" button at the bottom
      </p>

      <div class="mock-page__section">
        <h2>Desktop View (ms-web-summary-card)</h2>
        <div class="mock-page__card-container">
          <ms-web-summary-card
            [columns]="webColumns"
            [primaryButtonLabel]="'Aplică'"
            [footnoteText]="'Apăsând butonul Aplică vei fi redirecționat către un formular de contact.'">
          </ms-web-summary-card>
        </div>
      </div>

      <div class="mock-page__section">
        <h2>Mobile View Toggle</h2>
        <button class="mock-page__toggle-btn" (click)="showMobileModal = !showMobileModal">
          {{ showMobileModal ? 'Hide Mobile Modal' : 'Show Mobile Modal' }}
        </button>
      </div>

      <ms-mobile-summary-modal
        *ngIf="showMobileModal"
        [offers]="mobileOffers"
        (closed)="showMobileModal = false">
      </ms-mobile-summary-modal>
    </div>
  `,
  styles: [`
    .mock-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      font-family: var(--font-family-primary, 'Amalia'), sans-serif;
    }
    .mock-page h1 {
      color: var(--color-text-primary);
      margin-bottom: 16px;
    }
    .mock-page h2 {
      color: var(--color-text-primary);
      margin-bottom: 16px;
      font-size: 1.25rem;
    }
    .mock-page__description {
      color: var(--color-text-secondary);
      margin-bottom: 32px;
      line-height: 1.5;
    }
    .mock-page__section {
      margin-bottom: 48px;
    }
    .mock-page__card-container {
      max-width: 1200px;
    }
    .mock-page__toggle-btn {
      padding: 12px 24px;
      background: var(--accent-default);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
    }
    .mock-page__toggle-btn:hover {
      background: var(--accent-dark);
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class MockCostBreakdownComponent {
  showMobileModal = false;

  // Sample schedule PDF URL (BE team will provide real URLs)
  readonly sampleScheduleUrl = '/assets/docs/sample-schedule.pdf';

  // Mock cost breakdown data
  mockCostBreakdown = [
    { label: 'Suma împrumutată', value: '280.500,00 Lei', type: 'principal' },
    { label: 'Comision de aprobare', value: '500,00 Lei unic', frequency: 'unic', type: 'fee' },
    { label: 'Comision de administrare', value: '25,00 Lei /lună', frequency: '/lună', type: 'fee' },
    { label: 'Asigurare de viață', value: '120,00 Lei /lună', frequency: '/lună', type: 'insurance' },
    { label: 'Dobândă totală (estimată)', value: '245.678,00 Lei', type: 'interest' },
    { label: 'Reducere încasare salariu', value: '-12.500,00 Lei', type: 'discount' },
    { label: 'Reducere Casa Verde', value: '-8.000,00 Lei', type: 'discount' },
    { label: 'Reducere avans ≥20%', value: '-5.200,00 Lei', type: 'discount' }
  ];

  // Mock without API data (placeholder)
  mockCostBreakdownPlaceholder = [
    {
      label: 'Valoarea totală include: suma creditului, dobânda pe toată perioada, comisioane (aprobare, administrare, cont), asigurări obligatorii, și alte taxe bancare.',
      value: '',
      type: 'fee'
    }
  ];

  webColumns = [
    {
      title: 'Oferta ta personalizata',
      leftTop: { label: 'Dobândă inițială', amount: '5,69', currency: '%' },
      rightTop: { label: 'Rată lunară de plată', amount: '2.850,00', currency: 'Lei/lună' },
      extraDetails: [
        { label: 'Dobândă fixă', value: '5,69 %' },
        { label: 'Rată lunară (după trecerea anilor cu dobândă fixă)', value: '3.120,00 Lei' },
        { label: 'Dobândă variabilă', value: '6,78 %' },
        { label: 'DAE', value: '7,73 %' },
        { label: 'Tip rate', value: 'Rate egale' },
        { label: 'Avans', value: '49.500,00 Lei' },
        { label: 'Suma solicitată', value: '280.500,00 Lei' },
        { label: 'Valoarea totală plătibilă', value: '526.178,00 Lei' }
      ],
      costBreakdown: this.mockCostBreakdown,
      scheduleUrl: this.sampleScheduleUrl
    },
    {
      title: 'Cu toate reducerile',
      leftTop: { label: 'Dobândă inițială', amount: '5,29', currency: '%' },
      rightTop: { label: 'Rată lunară de plată', amount: '2.650,00', currency: 'Lei/lună' },
      extraDetails: [
        { label: 'Dobândă fixă', value: '5,29 %' },
        { label: 'Rată lunară (după trecerea anilor cu dobândă fixă)', value: '2.920,00 Lei' },
        { label: 'Dobândă variabilă', value: '6,38 %' },
        { label: 'DAE', value: '7,23 %' },
        { label: 'Tip rate', value: 'Rate egale' },
        { label: 'Avans', value: '66.000,00 Lei' },
        { label: 'Suma solicitată', value: '264.000,00 Lei' },
        { label: 'Valoarea totală plătibilă', value: '478.500,00 Lei' }
      ],
      costBreakdown: this.mockCostBreakdown,
      scheduleUrl: this.sampleScheduleUrl
    },
    {
      title: 'Fara reduceri',
      leftTop: { label: 'Dobândă inițială', amount: '6,49', currency: '%' },
      rightTop: { label: 'Rată lunară de plată', amount: '3.150,00', currency: 'Lei/lună' },
      extraDetails: [
        { label: 'Dobândă fixă', value: '6,49 %' },
        { label: 'Rată lunară (după trecerea anilor cu dobândă fixă)', value: '3.450,00 Lei' },
        { label: 'Dobândă variabilă', value: '7,58 %' },
        { label: 'DAE', value: '8,53 %' },
        { label: 'Tip rate', value: 'Rate egale' },
        { label: 'Avans', value: '49.500,00 Lei' },
        { label: 'Suma solicitată', value: '280.500,00 Lei' },
        { label: 'Valoarea totală plătibilă', value: '598.234,00 Lei' }
      ],
      costBreakdown: this.mockCostBreakdownPlaceholder,
      scheduleUrl: this.sampleScheduleUrl
    }
  ];

  mobileOffers = [
    {
      title: 'Oferta ta personalizată',
      type: 'personalized',
      monthlyInstallment: '2.850,00 Lei',
      fixedRate: '5,69%',
      variableRate: '6,78%',
      variableInstallment: '3.120,00 Lei',
      dae: '7,73%',
      installmentType: 'Rate egale',
      downPayment: '49.500,00 Lei',
      loanAmount: '280.500,00 Lei',
      totalAmount: '526.178,00 Lei',
      interestType: 'fixa_3',
      productType: 'achizitie-imobil',
      costBreakdown: this.mockCostBreakdown,
      scheduleUrl: this.sampleScheduleUrl
    },
    {
      title: 'Cu toate reducerile',
      type: 'all-discounts',
      monthlyInstallment: '2.650,00 Lei',
      fixedRate: '5,29%',
      variableRate: '6,38%',
      variableInstallment: '2.920,00 Lei',
      dae: '7,23%',
      installmentType: 'Rate egale',
      downPayment: '66.000,00 Lei',
      loanAmount: '264.000,00 Lei',
      totalAmount: '478.500,00 Lei',
      interestType: 'fixa_3',
      productType: 'achizitie-imobil',
      costBreakdown: this.mockCostBreakdown,
      scheduleUrl: this.sampleScheduleUrl
    },
    {
      title: 'Fără reduceri',
      type: 'no-discounts',
      monthlyInstallment: '3.150,00 Lei',
      fixedRate: '6,49%',
      variableRate: '7,58%',
      variableInstallment: '3.450,00 Lei',
      dae: '8,53%',
      installmentType: 'Rate egale',
      downPayment: '49.500,00 Lei',
      loanAmount: '280.500,00 Lei',
      totalAmount: '598.234,00 Lei',
      interestType: 'fixa_3',
      productType: 'achizitie-imobil',
      costBreakdown: this.mockCostBreakdownPlaceholder,
      scheduleUrl: this.sampleScheduleUrl
    }
  ];
}

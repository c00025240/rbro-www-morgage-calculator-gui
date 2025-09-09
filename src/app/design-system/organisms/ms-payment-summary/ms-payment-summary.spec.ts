import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPaymentSummary } from './ms-payment-summary';

describe('MsPaymentSummary', () => {
  let component: MsPaymentSummary;
  let fixture: ComponentFixture<MsPaymentSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsPaymentSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsPaymentSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsDownPaymentSection } from './ms-down-payment-section';

describe('MsDownPaymentSection', () => {
  let component: MsDownPaymentSection;
  let fixture: ComponentFixture<MsDownPaymentSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsDownPaymentSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsDownPaymentSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

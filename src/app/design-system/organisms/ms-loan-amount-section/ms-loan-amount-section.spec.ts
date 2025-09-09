import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsLoanAmountSection } from './ms-loan-amount-section';

describe('MsLoanAmountSection', () => {
  let component: MsLoanAmountSection;
  let fixture: ComponentFixture<MsLoanAmountSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsLoanAmountSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsLoanAmountSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

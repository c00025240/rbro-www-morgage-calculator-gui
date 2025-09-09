import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsLoanTermSection } from './ms-loan-term-section';

describe('MsLoanTermSection', () => {
  let component: MsLoanTermSection;
  let fixture: ComponentFixture<MsLoanTermSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsLoanTermSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsLoanTermSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

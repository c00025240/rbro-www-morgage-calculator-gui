import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsIncomeSection } from './ms-income-section';

describe('MsIncomeSection', () => {
  let component: MsIncomeSection;
  let fixture: ComponentFixture<MsIncomeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsIncomeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsIncomeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsRateOptionsSection } from './ms-rate-options-section';

describe('MsRateOptionsSection', () => {
  let component: MsRateOptionsSection;
  let fixture: ComponentFixture<MsRateOptionsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsRateOptionsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsRateOptionsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

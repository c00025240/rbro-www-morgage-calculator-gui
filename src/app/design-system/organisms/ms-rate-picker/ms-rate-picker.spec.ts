import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsRatePicker } from './ms-rate-picker';

describe('MsRatePicker', () => {
  let component: MsRatePicker;
  let fixture: ComponentFixture<MsRatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsRatePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsRatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

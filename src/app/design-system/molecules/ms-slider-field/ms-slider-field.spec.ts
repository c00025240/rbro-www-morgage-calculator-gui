import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSliderField } from './ms-slider-field';

describe('MsSliderField', () => {
  let component: MsSliderField;
  let fixture: ComponentFixture<MsSliderField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsSliderField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsSliderField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

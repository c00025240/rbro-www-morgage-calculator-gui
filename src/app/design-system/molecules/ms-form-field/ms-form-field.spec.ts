import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsFormField } from './ms-form-field';

describe('MsFormField', () => {
  let component: MsFormField;
  let fixture: ComponentFixture<MsFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsFormField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsElevation } from './ms-elevation';

describe('MsElevation', () => {
  let component: MsElevation;
  let fixture: ComponentFixture<MsElevation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsElevation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsElevation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypography } from './ms-typography';

describe('MsTypography', () => {
  let component: MsTypography;
  let fixture: ComponentFixture<MsTypography>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsTypography]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsTypography);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

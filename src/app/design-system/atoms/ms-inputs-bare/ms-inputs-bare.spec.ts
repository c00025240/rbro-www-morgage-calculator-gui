import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsInputsBare } from './ms-inputs-bare';

describe('MsInputsBare', () => {
  let component: MsInputsBare;
  let fixture: ComponentFixture<MsInputsBare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsInputsBare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsInputsBare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

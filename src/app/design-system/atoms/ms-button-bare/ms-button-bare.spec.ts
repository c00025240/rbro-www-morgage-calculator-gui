import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsButtonBare } from './ms-button-bare';

describe('MsButtonBare', () => {
  let component: MsButtonBare;
  let fixture: ComponentFixture<MsButtonBare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsButtonBare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsButtonBare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

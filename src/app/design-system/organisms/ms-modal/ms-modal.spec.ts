import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsModal } from './ms-modal';

describe('MsModal', () => {
  let component: MsModal;
  let fixture: ComponentFixture<MsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

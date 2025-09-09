import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsDsIndex } from './ms-ds-index';

describe('MsDsIndex', () => {
  let component: MsDsIndex;
  let fixture: ComponentFixture<MsDsIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsDsIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsDsIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

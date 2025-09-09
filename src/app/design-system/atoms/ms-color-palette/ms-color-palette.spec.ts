import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsColorPalette } from './ms-color-palette';

describe('MsColorPalette', () => {
  let component: MsColorPalette;
  let fixture: ComponentFixture<MsColorPalette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsColorPalette]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsColorPalette);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

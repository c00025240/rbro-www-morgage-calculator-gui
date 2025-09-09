import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsIcons } from './ms-icons';

describe('MsIcons', () => {
  let component: MsIcons;
  let fixture: ComponentFixture<MsIcons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsIcons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsIcons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

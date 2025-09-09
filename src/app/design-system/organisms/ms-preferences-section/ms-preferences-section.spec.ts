import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPreferencesSection } from './ms-preferences-section';

describe('MsPreferencesSection', () => {
  let component: MsPreferencesSection;
  let fixture: ComponentFixture<MsPreferencesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsPreferencesSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsPreferencesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

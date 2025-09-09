import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsSpacingTokens } from './ms-spacing-tokens';

describe('MsSpacingTokens', () => {
  let component: MsSpacingTokens;
  let fixture: ComponentFixture<MsSpacingTokens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsSpacingTokens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsSpacingTokens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

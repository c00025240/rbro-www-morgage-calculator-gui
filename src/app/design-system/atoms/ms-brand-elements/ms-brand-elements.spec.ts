import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsBrandElements } from './ms-brand-elements';

describe('MsBrandElements', () => {
  let component: MsBrandElements;
  let fixture: ComponentFixture<MsBrandElements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsBrandElements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsBrandElements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

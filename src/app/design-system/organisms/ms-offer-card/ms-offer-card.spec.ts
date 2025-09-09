import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsOfferCard } from './ms-offer-card';

describe('MsOfferCard', () => {
  let component: MsOfferCard;
  let fixture: ComponentFixture<MsOfferCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsOfferCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsOfferCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

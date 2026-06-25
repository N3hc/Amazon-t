import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoThingsComponent } from './promo-things.component';

describe('PromoThingsComponent', () => {
  let component: PromoThingsComponent;
  let fixture: ComponentFixture<PromoThingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoThingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

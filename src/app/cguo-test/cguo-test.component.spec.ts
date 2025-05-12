import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguoTestComponent } from './cguo-test.component';

describe('CguoTestComponent', () => {
  let component: CguoTestComponent;
  let fixture: ComponentFixture<CguoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CguoTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

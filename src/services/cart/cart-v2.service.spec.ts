import { TestBed } from '@angular/core/testing';

import { CartV2Service } from './cart-v2.service';

describe('CartV2Service', () => {
  let service: CartV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

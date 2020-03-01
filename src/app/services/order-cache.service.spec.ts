import { TestBed } from '@angular/core/testing';

import { OrderCacheService } from './order-cache.service';

describe('OrderCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderCacheService = TestBed.get(OrderCacheService);
    expect(service).toBeTruthy();
  });
});

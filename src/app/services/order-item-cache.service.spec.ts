import { TestBed } from '@angular/core/testing';

import { OrderItemCacheService } from './order-item-cache.service';

describe('OrderItemCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderItemCacheService = TestBed.get(OrderItemCacheService);
    expect(service).toBeTruthy();
  });
});

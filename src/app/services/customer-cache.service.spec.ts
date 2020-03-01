import { TestBed } from '@angular/core/testing';

import { CustomerCacheService } from './customer-cache.service';

describe('CustomerCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerCacheService = TestBed.get(CustomerCacheService);
    expect(service).toBeTruthy();
  });
});

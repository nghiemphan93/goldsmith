import { TestBed } from '@angular/core/testing';

import { ProductCacheService } from './product-cache.service';

describe('ProductCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductCacheService = TestBed.get(ProductCacheService);
    expect(service).toBeTruthy();
  });
});

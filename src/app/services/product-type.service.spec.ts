import { TestBed } from '@angular/core/testing';

import { ProductTypeService } from './product-type.service';

describe('ProductTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductTypeService = TestBed.get(ProductTypeService);
    expect(service).toBeTruthy();
  });
});

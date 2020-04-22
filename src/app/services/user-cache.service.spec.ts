import { TestBed } from '@angular/core/testing';

import { UserCacheService } from './user-cache.service';

describe('UserCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserCacheService = TestBed.get(UserCacheService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FontService } from './font.service';

describe('FontService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FontService = TestBed.get(FontService);
    expect(service).toBeTruthy();
  });
});

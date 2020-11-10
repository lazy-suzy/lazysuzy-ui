import { TestBed } from '@angular/core/testing';

import { PixelService } from './pixel.service';

describe('PixelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PixelService = TestBed.get(PixelService);
    expect(service).toBeTruthy();
  });
});

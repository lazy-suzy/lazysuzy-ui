import { TestBed } from '@angular/core/testing';

import { MatDialogUtilsService } from './matDialogUtils.service';

describe('MatDialogUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatDialogUtilsService = TestBed.get(MatDialogUtilsService);
    expect(service).toBeTruthy();
  });
});

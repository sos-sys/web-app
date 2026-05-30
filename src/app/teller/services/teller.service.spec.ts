import { TestBed } from '@angular/core/testing';

import { TellerService } from './teller.service';

describe('TellerService', () => {
  let service: TellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

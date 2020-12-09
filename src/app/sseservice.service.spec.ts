import { TestBed } from '@angular/core/testing';

import { SSEServiceService } from './sseservice.service';

describe('SSEServiceService', () => {
  let service: SSEServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSEServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

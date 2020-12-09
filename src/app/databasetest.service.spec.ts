import { TestBed } from '@angular/core/testing';

import { DatabasetestService } from './databasetest.service';

describe('DatabasetestService', () => {
  let service: DatabasetestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabasetestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

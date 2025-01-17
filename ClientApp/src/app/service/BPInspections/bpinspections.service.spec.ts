import { TestBed } from '@angular/core/testing';

import { BPInspectionsService } from './bpinspections.service';

describe('BPInspectionsService', () => {
  let service: BPInspectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPInspectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

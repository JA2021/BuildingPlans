import { TestBed } from '@angular/core/testing';

import { BPConstructionChecklistService } from './bpconstruction-checklist.service';

describe('BPConstructionChecklistService', () => {
  let service: BPConstructionChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPConstructionChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

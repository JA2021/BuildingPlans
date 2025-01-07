import { TestBed } from '@angular/core/testing';

import { BuilidngControlChecklistService } from './builidng-control-checklist.service';

describe('BuilidngControlChecklistService', () => {
  let service: BuilidngControlChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilidngControlChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

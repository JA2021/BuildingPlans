import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPConstructionChecklistComponent } from './bpconstruction-checklist.component';

describe('BPConstructionChecklistComponent', () => {
  let component: BPConstructionChecklistComponent;
  let fixture: ComponentFixture<BPConstructionChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPConstructionChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPConstructionChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

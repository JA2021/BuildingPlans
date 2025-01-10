import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPConstructionStagesComponent } from './bpconstruction-stages.component';

describe('BPConstructionStagesComponent', () => {
  let component: BPConstructionStagesComponent;
  let fixture: ComponentFixture<BPConstructionStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPConstructionStagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPConstructionStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

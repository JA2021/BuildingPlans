import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPBuildingControlsChecklistConfigComponent } from './bpbuilding-controls-checklist-config.component';

describe('BPBuildingControlsChecklistConfigComponent', () => {
  let component: BPBuildingControlsChecklistConfigComponent;
  let fixture: ComponentFixture<BPBuildingControlsChecklistConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPBuildingControlsChecklistConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPBuildingControlsChecklistConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

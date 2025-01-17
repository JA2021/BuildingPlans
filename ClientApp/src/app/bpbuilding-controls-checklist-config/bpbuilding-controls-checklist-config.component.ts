import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BpDepartmentsService } from '../service/BPDepartments/bp-departments.service';
import { MatTable } from '@angular/material/table';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { MatSelectModule } from '@angular/material/select';
import { BpConfirmModalComponent } from '../bp-confirm-modal/bp-confirm-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { MatDialog } from '@angular/material/dialog';
import { BuildingControlChecklistService } from '../service/BuildingControlChecklist/building-control-checklist.service'

export interface BuildingControlChecklist {
  BuildingControlChecklistID: number;
  FunctionalArea: string;
  ChecklistItem: string; 
  CreatedById: string;
  DateCreated: any;
  DateUpdated: any; 
}
export interface FunctionalAreaList{
  FunctionalAreaID: number;
  FAName: string;

}
@Component({
  selector: 'app-bpbuilding-controls-checklist-config',
  templateUrl: './bpbuilding-controls-checklist-config.component.html',
  styleUrls: ['./bpbuilding-controls-checklist-config.component.css']
})
export class BPBuildingControlsChecklistConfigComponent implements OnInit {


  constructor(private modalService: NgbModal, private buildingControlChecklistService: BuildingControlChecklistService, private functionalAreaService: BPFunctionalAreasService) { }


  BuildingControlChecklist: BuildingControlChecklist[] = [];
  functionalAreaList: FunctionalAreaList[] = [];

  @ViewChild(MatTable) ChecklistTable: MatTable<BuildingControlChecklist> | undefined;

  displayedColumns: string[] = ['ChecklistItem', 'actions'];
  dataSource = this.BuildingControlChecklist;

  buildingControlChecklistID: number;
  functionalArea: string;
  checklistItem: string;


  newFunctionalArea: string;
  newChecklistItem: string;

  stringifiedData: any;
  CurrentUser: any;

 
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllBuildingControlChecklistItems();
    this.getAllFunctionalAreas();
  }

  getAllFunctionalAreas() {
    this.functionalAreaList.splice(0, this.functionalAreaList.length);

    this.functionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempFunctionalArea = {} as FunctionalAreaList;
          const current = data.dateSet[i];

          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;
          tempFunctionalArea.FAName = current.faName;

          this.functionalAreaList.push(tempFunctionalArea);
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Functional Area Error", error);
    })
  }

  getAllBuildingControlChecklistItems() {
    this.BuildingControlChecklist.splice(0, this.BuildingControlChecklist.length);

    this.buildingControlChecklistService.getAllBuildingControlChecklistItems().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempChecklistItem = {} as BuildingControlChecklist;
          const current = data.dateSet[i];

          tempChecklistItem.BuildingControlChecklistID = current.buildingControlChecklistID;
          tempChecklistItem.FunctionalArea = current.functionalArea;
          tempChecklistItem.ChecklistItem = current.checklistItem;
          tempChecklistItem.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempChecklistItem.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.BuildingControlChecklist.push(tempChecklistItem)
        }

        this.dataSource = this.BuildingControlChecklist;
        this.ChecklistTable?.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Building Control Checklist Error", error);
    })
  }

  openAddNewChecklistItem(addChecklistItem: any) {
    this.buildingControlChecklistID = 0;
    this.newFunctionalArea = this.functionalAreaList[0].FAName;
    this.modalService.open(addChecklistItem, { centered: true, size: 'xl' }); 
  }

  AddUpdateBuildingControlChecklistItem() {
    this.buildingControlChecklistService.addUpdateBuildingControlChecklistItem(this.buildingControlChecklistID, this.newFunctionalArea, this.newChecklistItem, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.newChecklistItem = "";
        this.modalService.dismissAll();
        this.getAllBuildingControlChecklistItems();
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Add Checklist Item Error", error);
    })
  }


}

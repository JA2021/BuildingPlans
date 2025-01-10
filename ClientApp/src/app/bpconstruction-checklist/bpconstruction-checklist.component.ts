import { BPConstructionChecklistService } from '../service/BPConstructionChecklist/bpconstruction-checklist.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../shared/shared.service';
import { MatTable } from '@angular/material/table';

export interface ConstructionChecklist {
  ConstructionChecklistID: number;
  ApplicationID: number;
  ChecklistItem: string;
  isChecked: boolean;
  isApplicable: boolean;

}
@Component({
  selector: 'app-bpconstruction-checklist',
  templateUrl: './bpconstruction-checklist.component.html',
  styleUrls: ['./bpconstruction-checklist.component.css']
})
export class BPConstructionChecklistComponent implements OnInit {

  constructor(private sharedService: SharedService, private bpConstructionChecklistService: BPConstructionChecklistService) { }

  Checklist: ConstructionChecklist[] = [];
  ApplicationID: number;
  stringifiedData: any;
  CurrentUser: any;

  @ViewChild(MatTable) ChecklistTable: MatTable<ConstructionChecklist> | undefined;
  dataSource: any;
  displayedColumns: string[] = ['ChecklistItem', 'Yes', 'No', 'NotApplicable'];

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.ApplicationID = this.sharedService.getApplicationID();
    this.getAllConstructionChecklistItemsForApplication();
  }

 
  getAllConstructionChecklistItemsForApplication() {

    this.Checklist.splice(0, this.Checklist.length);

    this.bpConstructionChecklistService.getConstructionChecklistByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempItem = {} as ConstructionChecklist;
          const current = data.dateSet[i];

          tempItem.ConstructionChecklistID = current.constructionChecklistID;
          tempItem.ApplicationID = current.applicationID;
          tempItem.ChecklistItem = current.checklistItem;
          tempItem.isApplicable = current.isApplicable;
          tempItem.isChecked = current.isChecked;

          this.Checklist.push(tempItem);
        }

        this.dataSource = this.Checklist;
        console.log("Construction Checklist", this.Checklist);
        this.ChecklistTable?.renderRows();
        
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Construction Checklist Error", error); 
    })
  }

  //isChecked , not check , not Applicable 

  changeChecklistItemStatus(status: string, index: any) {

    const checklistItemID = this.Checklist[index].ConstructionChecklistID;

    if (status == "true") {
      this.bpConstructionChecklistService.changeChecklistItemStatus(checklistItemID, true, null).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.getAllConstructionChecklistItemsForApplication()
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Checklist Status Error", error);
      })
    }

    else if (status == "false") {
      this.bpConstructionChecklistService.changeChecklistItemStatus(checklistItemID, false, null).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.getAllConstructionChecklistItemsForApplication()
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Checklist Status Error", error);
      })
    }

    else if (status == "Not Applicable") {
      this.bpConstructionChecklistService.changeChecklistItemStatus(checklistItemID, null, false).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.getAllConstructionChecklistItemsForApplication()
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Checklist Status Error", error);
      })
    }
  }
}

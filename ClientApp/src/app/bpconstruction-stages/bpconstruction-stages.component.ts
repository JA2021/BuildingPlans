import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BpDepartmentsService } from '../service/BPDepartments/bp-departments.service';
import { MatTable } from '@angular/material/table';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { MatSelectModule } from '@angular/material/select';
import { BpConfirmModalComponent } from '../bp-confirm-modal/bp-confirm-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { MatDialog } from '@angular/material/dialog';
import { BPInspectionsService } from '../service/BPInspections/bpinspections.service';
import { BPConstructionChecklistService } from '../service/BPConstructionChecklist/bpconstruction-checklist.service';
import { SharedService } from '../shared/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatExpansionModule, } from '@angular/material/expansion';


export interface InspectionsCommentsList{
  InspectionID: number;
  ApplicationID: number;
  InspectionName: string;
  Notes: string;
  Status: string;
  Inspected: boolean;
  DateInspected: any;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

export interface ConstructionChecklist {
  ConstructionChecklistID: number;
  ApplicationID: number;
  ChecklistItem: string;
  isChecked: boolean;
  isApplicable: boolean;
  CreatedById: string;
  DateCreated: any;
  DateUpdated: any; 
}

export interface InspectionsList {
  InspectionName: string;
  Inspected: boolean;
  DateInspected: any; 
}
@Component({
  selector: 'app-bpconstruction-stages',
  templateUrl: './bpconstruction-stages.component.html',
  styleUrls: ['./bpconstruction-stages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BPConstructionStagesComponent implements OnInit {

  constructor(private modalService: NgbModal, private inspectionService: BPInspectionsService, private constructionChecklistService: BPConstructionChecklistService, private sharedService: SharedService) { }

  AllInspections: InspectionsList[] = [];
  expandedElement = this.AllInspections;

  openPanelIndex: number | null = null;

 

 

  constructionChecklist: ConstructionChecklist[] = [];
  inspectionsCommentsList: InspectionsCommentsList[] = [];

  stringifiedData: any;
  CurrentUser: any;

  @ViewChild(MatTable) InspectionCommentsTable: MatTable<InspectionsCommentsList> | undefined;
  displayedColumns: string[] = ['Comment', 'Status','DateCreated'];
  dataSource = this.inspectionsCommentsList;

  ApplicationID: number;
  selectedInspection: any;
  newComment: string;
  selectedDate: any;
  selectedIndex: any; 
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    
    this.ApplicationID = this.sharedService.getApplicationID();

    this.getAllInspectionsForApplication();
  }

 
 

  togglePanel(index: number): void {
    this.openPanelIndex = this.openPanelIndex === index ? null : index; // Toggle logic
  }
  getAllInspectionsForApplication() {
    const inspections = ['Foundation Inspection', 'Floor Slab Inspection', 'Drainage Inspection', 'Roof Inspection', 'Completion Checklist']

    for (let i = 0; i < inspections.length; i++) {
      const tempInspection = {} as InspectionsList;
      const current = inspections[i];

      tempInspection.InspectionName = current;
      tempInspection.Inspected = false;
      tempInspection.DateInspected = null;

      this.AllInspections.push(tempInspection);

    }
  }

  getAllInspectionCommentsForBySpectionName(index: any) {
    this.inspectionsCommentsList.splice(0, this.inspectionsCommentsList.length);

    this.selectedInspection = this.AllInspections[index].InspectionName;
    this.selectedIndex = index;

    debugger;
    this.inspectionService.getAllInspectionCommentsForApplicationByInspectionName(this.ApplicationID, this.selectedInspection).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempComment = {} as InspectionsCommentsList;
          const current = data.dateSet[i];
          debugger;
          tempComment.InspectionID = current.inspectionID;
          tempComment.ApplicationID = current.applicationID;
          tempComment.InspectionName = current.inspectionName;
          tempComment.Notes = current.notes;
          tempComment.Inspected = current.inspected;
          tempComment.Status = current.status;

          if (current.dateInspected != null) {
            tempComment.DateInspected = current.dateInspected.substring(0, current.dateInspected.indexOf("T"));
            this.AllInspections[index].DateInspected = tempComment.DateInspected;
          }
          else {
            tempComment.DateInspected = current.dateInspected;
          }

          tempComment.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempComment.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          if (current.inspected == true) {
            this.AllInspections[index].Inspected = true;
          }

          tempComment.CreatedById = current.createdById;

          this.inspectionsCommentsList.push(tempComment);
        }
        debugger;
        this.dataSource = this.inspectionsCommentsList;
        this.InspectionCommentsTable?.renderRows();

        this.togglePanel(index);
        console.log("dataSource", this.dataSource);
        console.log("Inspection Comments", this.inspectionsCommentsList);

       
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Inspection Comments Error", error);
    })
  }
  getAllConstructionChecklists() {
    this.constructionChecklist.splice(0, this.constructionChecklist.length);

    this.constructionChecklistService.getConstructionChecklistByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempChecklist = {} as ConstructionChecklist;
          const current = data.dateSet[i];

          tempChecklist.ConstructionChecklistID = current.constructionChecklistID;
          tempChecklist.ApplicationID = current.applicationID;
          tempChecklist.ChecklistItem = current.checklistItem;
          tempChecklist.isChecked = current.isChecked;
          tempChecklist.isApplicable = current.isApplicable;
          tempChecklist.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempChecklist.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempChecklist.CreatedById = current.createdById;

          this.constructionChecklist.push(tempChecklist);

        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Construction Checklist Error", error);
    })
  }

  openInspectionDate(InspectionDate: any) {
    this.modalService.open(InspectionDate, { centered: true, size: 'l' });
  }

  AddInspectionDate() {
    this.inspectionService.addUpdateInspection(0, this.ApplicationID, this.selectedInspection, "Date of inspection was added", "Inspected", true, this.selectedDate, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.getAllInspectionCommentsForBySpectionName(this.selectedIndex); 
      }
      else {
        alert(data.responseCode); 
      }
    }, error => {
      console.log("Add Inspection Error", error);
    })
  }

  closeDateModal() {
    this.selectedDate = null; 
    this.AllInspections[this.selectedIndex].Inspected = false; 
  }

  SaveNewComment() {
    var Status = "";
    if (this.AllInspections[this.selectedIndex].Inspected == true) {
      Status = "Inspected";
    }
    else {
      Status = "Not Inspected";
    }
    this.inspectionService.addUpdateInspection(0, this.ApplicationID, this.selectedInspection, this.newComment, Status, this.AllInspections[this.selectedIndex].Inspected, this.selectedDate, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.getAllInspectionCommentsForBySpectionName(this.selectedIndex);
      }
      else {
        alert(data.responseCode);
      }
    }, error => {
      console.log("Add Inspection Error", error);
    })
  }
}

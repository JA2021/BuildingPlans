import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPConstructionChecklistService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPConstructionChecklists/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateConstuctionChecklist(constructionChecklistID: number | null, applicationID: number | null, checklistItem: string | null, isChecked: boolean | null , isApplicable : boolean | null , createdById :string | null  ) {
    const body = {
      ConstructionChecklistID: constructionChecklistID,
      ApplicationID: applicationID,
      ChecklistItem: checklistItem,
      IsChecked: isChecked,
      isApplicable: isApplicable,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateConstructionChecklist", body);
  }

  public getConstructionChecklistByApplicationID(applicationID: number | null) {
    const body = {
      ApplicationID :applicationID 
    }

    return this.httpClient.post(this.baseURL + "GetConstructionChecklistByApplicationID", body);
  }

  public changeChecklistItemStatus(constructionChecklistID: number | null, isChecked : boolean | null, isApplicable : boolean | null) {
    const body = {
      ConstructionChecklistID: constructionChecklistID,
      IsChecked: isChecked,
      isApplicable: isApplicable 
    }

    return this.httpClient.post(this.baseURL + "ChangeChecklistItemStatus", body);
  }

  public deleteConstructionChecklistItem(constructionChecklistID: number | null) {
    const body = {

      ConstructionChecklistID: constructionChecklistID
    }

    return this.httpClient.post(this.baseURL + "DeleteConstructionChecklistItem", body);
  }

  public addAllChecklistItemsToApplication( constructionChecklistID : number | null , applicationID: number | null, createdById: string | null) {
    const body = {
      ConstructionChecklistID: constructionChecklistID,
      ApplicationID: applicationID,
      CreatedById : createdById 
    }

    return this.httpClient.post(this.baseURL + "AddAllChecklistItemsToApplication", body);
  }
}

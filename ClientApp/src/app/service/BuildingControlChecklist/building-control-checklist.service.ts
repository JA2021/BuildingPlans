import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingControlChecklistService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPBuildingControlChecklist/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateBuildingControlChecklistItem(buildingControlChecklistID: number | null, functionalArea: string | null, checklistItem: string | null, createdById: string | null) {
    const body = {
      BuildingControlChecklistID: buildingControlChecklistID,
      FunctionalArea: functionalArea,
      ChecklistItem: checklistItem,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateBuildingControlChecklistItem", body);
  }

  public deleteBuildingControlChecklistItem(buildingControlChecklistID: number | null) {
    const body = {
      BuildingControlChecklistID: buildingControlChecklistID
    }

    return this.httpClient.post(this.baseURL + "DeleteBuildingControlChecklistItem", body);
  }

  public getAllChecklistItemsForFunctionalArea(functionalArea: string | null) {
    const body = {
      FunctionalArea :functionalArea 
    }

    return this.httpClient.post(this.baseURL + "GetAllChecklistItemsForFunctionalArea", body);
  }

  public getChecklistItemsByBuildingControlChecklistID(buildingControlChecklistID: number | null) {
    const body = {
      BuildingControlChecklistID: buildingControlChecklistID
    }

    return this.httpClient.post(this.baseURL + "GetChecklistItemsByBuildingControlChecklistID", body);
  }

  public getAllBuildingControlChecklistItems() {

    return this.httpClient.get(this.baseURL + "GetAllBuildingControlChecklistItems"); 
  }
}

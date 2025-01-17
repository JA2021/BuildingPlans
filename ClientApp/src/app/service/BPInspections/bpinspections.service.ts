import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPInspectionsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPInspections/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateInspection(inspectionID: number | null, applicationID: number | null, inspectionName: string | null, notes: string | null, status: string | null, inspected: boolean | null, dateInspected: any | null, createdById: string | null) {
    const body = {
      InspectionID: inspectionID,
      ApplicationID: applicationID,
      InspectionName: inspectionName,
      Notes: notes,
      Status: status,
      Inspected: inspected,
      DateInspected: dateInspected,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateInspection", body);
  }

  public getAllInspectionsForApplication(applicationID: number | null) {
    const body = {
      ApplicationID: applicationID
    }

    return this.httpClient.post(this.baseURL + "GetAllInpectionsForApplication", body);
  }

  public deleteInspectionByInspectionID(inspectionID: number | null) {
    const body = {
      InspectionID : inspectionID
    }

    return this.httpClient.post(this.baseURL + "DeleteInspectionByInspectionID", body);
  }

  public getAllInspectionCommentsForApplicationByInspectionName(applicationID: number | null, inspectionName: string | null) {
    const body = {
      ApplicationID: applicationID,
      InspectionName :inspectionName
    }

    return this.httpClient.post(this.baseURL + "GetAllInspectionsCommentsForApplicationByInspectionName", body);
  }
}

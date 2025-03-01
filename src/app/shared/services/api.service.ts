import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private serverIp = "localhost:8080";

  constructor(
    private http: HttpClient
  ) { }

  getTilesList(page: number, size: number, sortBy: string, sortDirection: string) {
    const apiuri = `http://${this.serverIp}/api/tiles/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getTileDetail(id: string) {
    const apiuri =` http://${this.serverIp}/api/tiles/tile-detail/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

}


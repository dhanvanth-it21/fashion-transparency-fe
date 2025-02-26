import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OverviewMetrics } from '../models/overview-metrics.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/admin/dashboard';

  constructor(
    private http: HttpClient,
  ) { }


  //fetching the overview stats
  getOverviewMetrics(): Observable<OverviewMetrics> {
    return this.http.get<OverviewMetrics>(`${this.apiUrl}/overview`);
  }
}

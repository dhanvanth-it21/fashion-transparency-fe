import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrdersComponent } from "../orders/orders.component";
import { ApiService } from '../../../shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {



  metrics: {
    label: string,
    value: number,
    key: string,
  }[] = [
    {label: "Total Inventory Items", value: 0, key: "totalInventoryItems"},
    {label: "Picking Orders", value: 0, key: "totalPickingOrders"},
    {label : "Total Damage Reports", value: 0, key : "totalDamageReports"},
    {label : "Approved Damage Reports", value: 0, key : "approvedDamagedReports"},
    {label : "Rejected Damage Reports", value: 0, key : "rejectedDamagedReports"},
    {label : "Under Review Damage Reports", value: 0, key : "underReviewDamagedReports"},
  ]


  

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.getOverviewMetrics();

  }

  getOverviewMetrics() {
    this.apiService.getEmployeeOverviewMetrics().subscribe(
      {
        next: (response: any) => {
          const data = response.data;
          this.metrics.forEach((metric: any) => {
            metric.value = data[metric.key]
          })
          
        },
        error: (e) => {console.error(e)}
      }
    );
  }


}

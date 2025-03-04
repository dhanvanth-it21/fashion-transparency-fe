import { Component } from '@angular/core';
import { OverviewMetrics } from '../models/overview-metrics.model';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrdersComponent } from "../orders/orders.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, OrdersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    allowed: {isHeadingNeeded: boolean, allowPagination: {isPaginated: boolean, pageSize: boolean},} = {
      isHeadingNeeded: false,
      allowPagination: {
        isPaginated: true,
        pageSize: false,
      }
    }
    searchPendingOrdersBy = "PENDING"
    searchDispatchedOrdersBy = "DISPATCHED"

  metrics: OverviewMetrics = {
    totalOrders: 0,
    totalInventoryItems: 0,
    totalEmployees: 0,
    totalUnseenDamagesReported: 0
  }

  

  constructor() {}


}

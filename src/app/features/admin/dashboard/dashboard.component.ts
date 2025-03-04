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

    iconsUsed = {
      prev: faArrowLeft,
      next: faArrowRight,      
    };

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

  //sample data
  pendingOrders = [
    { orderId: '1001', retailer: 'Retailer A', orderDate: '2025-02-25', status: 'Pending' },
    { orderId: '1002', retailer: 'Retailer B', orderDate: '2025-02-24', status: 'Pending' },
    { orderId: '1002', retailer: 'Retailer B', orderDate: '2025-02-24', status: 'Pending' },
    { orderId: '1002', retailer: 'Retailer B', orderDate: '2025-02-24', status: 'Pending' },
    { orderId: '1002', retailer: 'Retailer B', orderDate: '2025-02-24', status: 'Pending' },
  ];

  //smaple data
  dispatchedOrders = [
    { orderId: '2001', retailer: 'Retailer C', dispatchDate: '2025-02-26', status: 'Dispatched' },
    { orderId: '2002', retailer: 'Retailer D', dispatchDate: '2025-02-26', status: 'Dispatched' },
  ];


}

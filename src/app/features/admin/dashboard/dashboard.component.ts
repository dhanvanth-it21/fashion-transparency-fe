import { Component } from '@angular/core';
import { OverviewMetrics } from '../models/overview-metrics.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

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

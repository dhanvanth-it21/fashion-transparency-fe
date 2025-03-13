import { Component } from '@angular/core';
import { OverviewMetrics } from '../models/overview-metrics.model';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrdersComponent } from "../orders/orders.component";
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, OrdersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    allowed: {
      isHeadingNeeded: boolean, 
      allowPagination: {isPaginated: boolean, pageSize: boolean},
      actionButtons: {expand: boolean, edit: boolean, delete: boolean}
    } = {
      isHeadingNeeded: false,
      allowPagination: {
        isPaginated: true,
        pageSize: false,
      },
      actionButtons:{
        expand: true,
        edit: false,
        delete: false
      }
    }
    searchPendingOrdersBy = "PENDING"
    searchDispatchedOrdersBy = "DISPATCHED"

  metrics: {
    label: string,
    value: number,
    key: string,
  }[] = [
    {label: "Total Inventory Items", value: 0, key: "totalInventoryItems"},
    {label: "Pending Orders", value: 0, key: "totalPendingOrders"},
    {label : "Total Orders", value: 0, key : "totalOrders"},
    {label : "Unseen Damages", value: 0, key : "unseenDamagesReported"},
  ]

  damageMetrics: {
    label: string,
    value: number,
    key: string,
  }[] = [
    { "label": "Warehouse", "value": 2, "key": "warehouse" },
    { "label": "Retail Shop", "value": 3, "key": "retailShop" },
    { "label": "Manufacturer", "value": 0, "key": "manufacturer" }
  ]

  lowStocks: {
    label: string,
    value: number,
    key: string,
  }[] = [
    { "label": "Low Stock", "value": 0, "key": "lowStock" },
  ]
  



  selectedFilterForPending: string = 'PENDING'
  selectedFilterForDispatched: string = 'DISPATCHED'

  

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.getOverviewMetrics();
    this.getDamageMetrics();
    this.getTotalLowStocks();
  }

  getOverviewMetrics() {
    this.apiService.getOverviewMetrics().subscribe((response: any) => {
      const data = response.data;
      this.metrics.forEach((metric: any) => {
        metric.value = data[metric.key]
      })
      
    });
  }

  getDamageMetrics() {
    this.apiService.getDamageMetrics().subscribe(
      {
        next: (response: any) => {
          const data = response.data;
          this.damageMetrics.forEach((metric: any) => {
            metric.value = data[metric.key]
          }) 
        },
        error: (e) => {console.error(e)},
      }
    );
  }

  getTotalLowStocks() {
    this.apiService.getTotalLowStocks().subscribe({
      next: (response: any) => {
        this.lowStocks.forEach(lowStock => {
          lowStock.value = response.data;
        })
      },
      error: (e) => {console.error(e)},
    })
  }


}

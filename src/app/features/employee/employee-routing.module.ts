import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeModule } from './employee.module';
import { AuthGuard } from '../../core/auth.guard';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [
  {
      path: "",
      component: EmployeeComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: "",
          redirectTo: "dashboard",
          pathMatch: "full"
        },
        {
          path: "dashboard",
          loadComponent: () => import("./dashboard/dashboard.component")
            .then(m => m.DashboardComponent),
        },
        {
          path: "orders",
          loadComponent: () => import("./orders/orders.component")
            .then(m => m.OrdersComponent),
          children: [
            {
              path: "update-order/:id",
              loadComponent: () => import("./orders/orders.component")
                .then(m => m.OrdersComponent),
            },
  
          ]
        },
        {
          path: "purchases",
          loadComponent: () => import("./purchase/purchase.component")
            .then(m => m.PurchasesComponent),
            children: [
              {
                path: "update-purchase/:id",
                loadComponent: () => import("./orders/orders.component")
                .then(m => m.OrdersComponent),
              },
            ],
          },
          {
            path: "purchases/add-purchase",
            loadComponent: () => import("./purchase/create-purchase/create-purchase.component")
              .then(m => m.CreatePurchaseComponent),
          },
          {
            path: "damage-reports",
            loadComponent: () => import("../admin/damages/damages.component")
            .then(m => m.DamagesComponent)
          },
          {
            path: "damage-reports/create-damage-report",
            loadComponent: () => import("../admin/damages/create-damage-report/create-damage-report.component")
              .then(m => m.CreateDamageReportComponent),
          },
          {
            path: "inventory",
            loadComponent: () => import("../admin/inventory/inventory.component")
              .then(m => m.InventoryComponent),
          },
          {
            path: "api-usage",
            loadComponent: () => import("../../shared/api-usage/api-usage.component")
            .then(m =>m.ApiUsageComponent)
          },
      ]
      
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
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
          {
            path: "order-tracker/:id",
            loadComponent: () => import("./orders/orders.component")
              .then(m => m.OrdersComponent),
          },

        ]
      },
      {
        path: "orders/create-order",
        loadComponent: () => import("./orders/create-order/create-order.component")
          .then(m => m.CreateOrderComponent),
      },
      {
        path: "purchases",
        loadComponent: () => import("./purchase/purchase.component")
          .then(m => m.PurchasesComponent),
        children: [
          {
            path: "update-purchase/:id",
            loadComponent: () => import("./purchase/purchase.component")
              .then(m => m.PurchasesComponent),
          },

        ]
      },
      {
        path: "purchases/add-purchase",
        loadComponent: () => import("./purchase/create-purchase/create-purchase.component")
          .then(m => m.CreatePurchaseComponent),
      },
      {
        path: "inventory",
        loadComponent: () => import("./inventory/inventory.component")
          .then(m => m.InventoryComponent),
        children: [
          {
            path: "add-tile",
            loadComponent: () => import("./inventory/inventory.component")
              .then(m => m.InventoryComponent),
          },
          {
            path: "update-tile/:id",
            loadComponent: () => import("./inventory/update-tile/update-tile.component")
              .then(m => m.UpdateTileComponent),
          }

        ]
      },
      // {
      //   path: "employees",
      //   loadComponent: () => import("./employees/employees.component")
      //   .then(m => m.EmployeesComponent),
      // },
      {
        path: "retail-shop",
        loadComponent: () => import("./retail-shop/retail-shop.component")
          .then(m => m.RetailShopComponent),
        children: [
          {
            path: "add-retail-shop",
            loadComponent: () => import("./retail-shop/retail-shop.component")
              .then(m => m.RetailShopComponent),
          },
          {
            path: "update-retail-shop/:id",
            loadComponent: () => import("./retail-shop/retail-shop.component")
              .then(m => m.RetailShopComponent),
          },

        ]
      },
      {
        path: "supplier",
        loadComponent: () => import("./suppliers/suppliers.component")
          .then(m => m.SuppliersComponent),
        children: [
          {
            path: "add-supplier",
            loadComponent: () => import("./suppliers/suppliers.component")
              .then(m => m.SuppliersComponent),
          },
          {
            path: "update-supplier/:id",
            loadComponent: () => import("./suppliers/suppliers.component")
              .then(m => m.SuppliersComponent),
          },

        ]
      },
      {
        path: "damage-reports",
        loadComponent: () => import("./damages/damages.component")
          .then(m => m.DamagesComponent),
        children: [
          
          {
            path: "update-damage-report/:id",
            loadComponent: () => import("./damages/create-damage-report/create-damage-report.component")
              .then(m => m.CreateDamageReportComponent),
          }
        ]
      },
      {
        path: "damage-reports/create-damage-report",
        loadComponent: () => import("./damages/create-damage-report/create-damage-report.component")
          .then(m => m.CreateDamageReportComponent),
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
export class AdminRoutingModule { }

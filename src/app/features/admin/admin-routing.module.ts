import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
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
      {
        path: "employees",
        loadComponent: () => import("./employees/employees.component")
        .then(m => m.EmployeesComponent),
      },
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

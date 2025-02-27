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
          }
        ]
      },
      {
        path: "employees",
        loadComponent: () => import("./employees/employees.component")
        .then(m => m.EmployeesComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

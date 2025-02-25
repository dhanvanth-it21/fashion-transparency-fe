import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./core/main-layout/view/view.component")
        .then(m => m.ViewComponent),
        children: [
            { path: "", redirectTo: "dashboard", pathMatch: "full" },
            { 
                path: "dashboard", 
                loadComponent: () => import("./features/admin/dashboard/dashboard.component")
                .then(m => m.DashboardComponent) 
            },
            { 
                path: "inventory", 
                loadComponent: () => import("./features/admin/inventory/inventory.component")
                .then(m => m.InventoryComponent) 
            },
            { 
                path: "orders", 
                loadComponent: () => import("./features/admin/orders/orders.component")
                .then(m => m.OrdersComponent) 
            },
            { 
                path: "employees", 
                loadComponent: () => import("./features/admin/employees/employees.component")
                .then(m => m.EmployeesComponent) 
            },
            
        ]
    }
];

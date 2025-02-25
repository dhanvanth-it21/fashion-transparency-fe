import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "admin",
        loadComponent: () => import('./features/admin/dashboard/dashboard.component')
                            .then(m => m.DashboardComponent)
    }
];

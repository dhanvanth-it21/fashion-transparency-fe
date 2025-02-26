import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { ViewComponent } from './core/main-layout/view/view.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ViewModule } from './core/main-layout/view/view.module';

export const 
routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./core/main-layout/view/view.module")
        .then(m => ViewModule), 
    }
];

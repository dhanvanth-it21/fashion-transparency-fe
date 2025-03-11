import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { ViewComponent } from './core/main-layout/view/view.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ViewModule } from './core/main-layout/view/view.module';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./core/login/login.component")
      .then(m => m.LoginComponent)
  },
  {
    path: "",
    loadChildren: () => import("./core/main-layout/view/view.module")
      .then(m => ViewModule),
    canActivate: [AuthGuard]
  }
];

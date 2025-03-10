import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view.component';

const routes: Routes = [
  {
    path: "",
    component: ViewComponent,
    children: [
      // {
      //   path: "",
      //   redirectTo: "admin",
      //   pathMatch: "full"
      // },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
      },
      {
        path: "login",
        loadComponent: () => import("../../login/login.component")
        .then(m => m.LoginComponent)
      },
      {
        path: "admin",
        loadChildren: () => import("../../../features/admin/admin.module")
        .then(m => m.AdminModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }

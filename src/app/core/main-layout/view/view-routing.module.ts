import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view.component';
import { AuthGuard } from '../../../core/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: ViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "admin",
        pathMatch: "full"
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeModule } from './employee.module';
import { AuthGuard } from '../../core/auth.guard';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [
  {
      path: "",
      component: EmployeeComponent,
      canActivate: [AuthGuard]
      
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {


  constructor(
    private router: Router,
  ) { } 


  openCreateOrderForm() {
    this.router.navigate(["/admin/orders/create-order"]);
  }
 

}

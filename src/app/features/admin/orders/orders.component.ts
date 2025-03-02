import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  paging = {
    page_number: 0,
    page_size: 8,
    total_pages: 1,
    is_first: true,
    is_last: true,
    total_elements: 0,
    sort_by: "_id",
  }


  tableHeader = [
    {name: "S No.", class: "make-center", sortBy: "_id", sortDirection: "asc"},
    
  ]

}

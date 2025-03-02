import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-retail-shop',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './retail-shop.component.html',
  styleUrl: './retail-shop.component.css'
})
export class RetailShopComponent {


  private _dataDetailId: string = "";

  get dataDetailId(): string {
    return this._dataDetailId;
  }

  set dataDetailId(value: string) {
    this._dataDetailId = value;
    this.onDataDetailIdChange();
  }
 

  private _dataDetail: any = null;

  get dataDetail(): any {
    return this._dataDetail;
  }

  set dataDetail(value: any) {
    this._dataDetail = value;
    this.onDataDetailChange();
  }

  


  paging = {
    page_number: 0,
    page_size: 5,
    total_pages: 1,
    is_first: true,
    is_last: true,
    total_elements: 0,
    sort_by: "_id",
  }


  tableHeader: any[] = [
    {name: "S No.", class: "", sortBy: "_id", sortDirection: "asc"},
    {name: "Shop Name", class: "", sortBy: "shopName", sortDirection: "asc"},
    {name: "Phone", class: "", sortBy: "phone", sortDirection: "asc"},
  ]
 

  displayData!: any[];


  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.getRetailShopsList();
  }

  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getRetailShopsList(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }


  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getRetailShopsList(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    //do nothing
  }

  onDataDetailIdChange() {
    this.getRetailShopById(this.dataDetailId);
  }




  //------------------------------------------------------------------
  getRetailShopsList(page: number = this.paging.page_number, size: number = this.paging.page_size, sortBy: string = "_id", sortDirection: string = "asc", search: string = "") {
    this.apiService.getRetailShopsList(page, size, sortBy, sortDirection, search).subscribe(
      {
        next: (response: any) => {
          if (response.status === "success" && response.data) {
            this.displayData = response.data;
            this.paging.is_first = response.metadata.isFirst;
            this.paging.is_last = response.metadata.isLast;
            this.paging.page_number = response.metadata.pageable.pageNumber;
            this.paging.page_size = response.metadata.pageable.pageSize;
            this.paging.total_elements = response.metadata.totalElements;
            this.paging.total_pages = response.metadata.totalPages;
            console.log("response", response);
          }
        },
        error: (e) => { console.error(e) },
      }
    )
  }


  getRetailShopById(id: string) {
    this.apiService.getRetailShopById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.dataDetail = response.data;
        }
      },
      error: (e) => { console.error(e) },
    })
  }




}

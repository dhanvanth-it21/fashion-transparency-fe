import { Component } from '@angular/core';
import { AddFormComponent } from '../components/add-form/add-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-api-usage',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './api-usage.component.html',
  styleUrl: './api-usage.component.css'
})
export class ApiUsageComponent {




  //two way data binding variables
  private _dataDetailId: string = "";
  private _dataDetail: any = null;
  private _searchText: string = "";




  //(start)---------------getters and setters for the two way binding variables------------
  get dataDetailId(): string {
    return this._dataDetailId;
  }

  set dataDetailId(value: string) {
    this._dataDetailId = value;
    this.onDataDetailIdChange();
  }

  get dataDetail(): any {
    return this._dataDetail;
  }

  set dataDetail(value: any) {
    this._dataDetail = value;
    this.onDataDetailChange();
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    this._searchText = value;
    this.onSearchTextChange();
  }
  //(end)---------------getters and setters for the two way binding variables------------

  searchSubject = new Subject<string>();
  isAddRetailShopOpen: Boolean = false;
  isUpdateRetailShopOpen: Boolean = false;




  paging = {
    page_number: 0,
    page_size: 5,
    total_pages: 1,
    is_first: true,
    is_last: true,
    total_elements: 0,
    sort_by: "payment",
  }

  actionButtons: { expand: boolean, edit: boolean, delete: boolean, tracker: boolean } = {
    expand: true,
    edit: false,
    delete: false,
    tracker: false,
  }


  tableHeader: any[] = [
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Start Date", class: "", sortBy: "billingCycleStart", sortDirection: "asc" },
    { name: "End Date", class: "", sortBy: "billingCycleEnd", sortDirection: "asc" },
    { name: "Total Amount", class: "", sortBy: "totalAmount", sortDirection: "asc" },
    { name: "Payment Status", class: "", sortBy: "payment", sortDirection: "asc" },
  ]



  expandDetail = [

  ]





  displayData!: any[];


  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getApiUsage();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.getApiUsage(undefined, undefined, undefined, undefined, searchTerm);
    });
  }

  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getApiUsage(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }


  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getApiUsage(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    //do nothing
  }

  onDataDetailIdChange() {
    this.getApiUsageById(this.dataDetailId);
  }


  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }


  openAddRetailShopForm() {
    this.router.navigate(["add-retail-shop"], { relativeTo: this.activatedRoute });
  }




  //------------------------------------------------------------------
  getApiUsage(page: number = this.paging.page_number, size: number = this.paging.page_size, sortBy: string = "payment", sortDirection: string = "asc", search: string = "") {
    this.apiService.getApiUsage(page, size, sortBy, sortDirection, search).subscribe(
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
          }
        },
        error: (e) => { console.error(e) },
      }
    )
  }


  getApiUsageById(id: string) {
    this.apiService.getApiUsageById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.dataDetail = response.data;
        }
      },
      error: (e) => { console.error(e) },
    })
  }

  paymentForId(id: string) {

    const bill = this.displayData.find(data => data._id === id)
    if(bill.payment) {
      return;
    }
    this.router.navigate([`/loading`]);
    console.log("checking the api-usage component after redirecting to the loading component")
    this.apiService.getPaymentLink(id, bill.totalAmount).subscribe(
      {
        next: (response: any) => {
          console.log(response.data);
          window.open(response.data)
        },
        error: (e) => console.error(e)
      }
    );
  }


}

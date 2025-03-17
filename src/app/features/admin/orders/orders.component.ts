import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TableComponent } from "../../../shared/components/table/table.component";
import { AddFormComponent } from "../../../shared/components/add-form/add-form.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { OrderTrackerComponent } from "./order-tracker/order-tracker.component";
import { icon, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterModule, TableComponent, AddFormComponent, CommonModule, ReactiveFormsModule, FormsModule, OrderTrackerComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {


  @Input()
  allowed: {
    isHeadingNeeded: boolean,
    allowPagination: { isPaginated: boolean, pageSize: boolean },
    actionButtons: { expand: boolean, edit: boolean, delete: boolean, tracker: boolean }
  } = {
      isHeadingNeeded: true,
      allowPagination: {
        isPaginated: true,
        pageSize: true,
      },
      actionButtons: {
        expand: true,
        edit: true,
        delete: false,
        tracker: true
      }
    }


  public faClose: IconDefinition = faClose;
      

  //two way data binding variables
  private _dataDetailId: string = "";
  private _dataDetail: any = null;
  private _searchText: string = "";
  private _selectedFilter: string = '';

  updateDataDetailId: string = "";
  orderTrackerByOrderId: string = "";
  updateDataDetail: any;
  updateDetailFormGroup: FormGroup = new FormGroup([]);

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

  get selectedFilter(): string {
    return this._selectedFilter;
  }

  @Input()
  set selectedFilter(value: string) {
    const allowedValues = ['PENDING', 'DISPATCHED'];
    if (allowedValues.includes(value)) {
      this._selectedFilter = value;
    } else {
      this._selectedFilter = "";
    }
    this.getOrdersList();

  }

  @Input()
  set searchText(value: string) {
    this._searchText = value;
    this.onSearchTextChange();
  }
  //(end)---------------getters and setters for the two way binding variables------------


  searchSubject = new Subject<string>();
  isUpdateOrderOpen: Boolean = false;
  isOrderTrackerOpen: Boolean = false;

  formGroup!: FormGroup;

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
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Shop Name", class: "", sortBy: "shopName", sortDirection: "asc" },
    { name: "Order Id", class: "", sortBy: "orderId", sortDirection: "asc" },
    { name: "Status", class: "", sortBy: "status", sortDirection: "asc" },
  ]

  formConfig = [
    { key: 'shopName', label: 'Shop Name', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['PENDING', 'PICKING', 'DISPATCHED', 'DELIVERED'] },
  ];

  expandDetail = [
    { key: 'salesId', label: 'Sales ID' },
    { key: 'shopName', label: 'Shop Name' },
    { key: 'status', label: 'Status' },
    { key: 'damagePercentage', label: 'Damage Percentage' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' }
  ];



  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Update Order Status",
      submit: "Update",
      discard: "Discard"
    }

  displayData!: any[];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getOrdersList(undefined, undefined, undefined, undefined, this.searchText);
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.getOrdersList(undefined, undefined, undefined, undefined, searchTerm);
    });
    this.subscriveToRouteChange();
  }


  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getOrdersList(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }


  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getOrdersList(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    //do nothing
  }

  onDataDetailIdChange() {
    this.getOrderById(this.dataDetailId);
  }


  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  openAddOrderForm() {
    this.router.navigate(["add-order"], { relativeTo: this.activatedRoute });
  }


  subscriveToRouteChange() {
    if (this.router.url.startsWith("/admin/orders/update-order")) {
      this.isUpdateOrderOpen = false;
      this.router.navigate(['/admin/orders'])
    }
    if (this.router.url.startsWith("/admin/orders/order-tracker")) {
      this.isOrderTrackerOpen = false;
      this.router.navigate(['/admin/orders'])
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith("/admin/orders/update-order")) {
          this.isUpdateOrderOpen = true;
          this.isOrderTrackerOpen = false;
        }
        else if(event.url.startsWith("/admin/orders/order-tracker")) {
          this.isOrderTrackerOpen = true;
          this.isUpdateOrderOpen = false;
        }
        else {
          this.isUpdateOrderOpen = false;
          this.isOrderTrackerOpen = false;
        }
      }
    })
  }


  updateFormSubmit(event: any) {
    if (this.updateDataDetail.status == event.status) {
     Swal.fire(
     {
      icon: "info",
      title: "Tring to update the same state of order",
      text: "No changes made",
      timer: 2000,
     }
     )
      return;
    }
    this.updateOrderStatusById(event._id, event.status);
    this.router.navigate(['/admin/orders']);
  }


  updateFormDiscard() {
    this.updateDataDetail = null;
    this.updateDataDetailId = "";
    this.router.navigate(['/admin/orders']);
  }




  updateOrder(id: string) {
    this.updateDataDetailId = id;
    this.getOrderDetailById(id);
  }

  openOrderTracker(id: string) {
    this.orderTrackerByOrderId = id;
    this.router.navigate(["order-tracker", id], { relativeTo: this.activatedRoute });
  }

  initailzeUpdateFormGroup() {
    this.updateDetailFormGroup = this.formBuilder.group({
      _id: this.updateDataDetailId,
      shopName: [{ value: this.updateDataDetail.shopName, disabled: true }, Validators.required],
      status: [this.updateDataDetail.status, [Validators.required, Validators.pattern('^(PENDING|PICKING|DISPATCHED|DELIVERED)$')]],
    });
  }

  openCreateOrderForm() {
    this.router.navigate(["/admin/orders/create-order"]);
  }

  closeOrderTracker() {
    this.orderTrackerByOrderId = "";
    this.isOrderTrackerOpen = false;
    this.router.navigate(['/admin/orders']);
  }

  //-----------------------------------------------------------------
  getOrdersList(page: number = this.paging.page_number, size: number = this.paging.page_size, sortBy: string = "_id", sortDirection: string = "asc", search: string = this.searchText, selectedFilter: string = this.selectedFilter) {
    this.apiService.getOrdersList(page, size, sortBy, sortDirection, search, this.selectedFilter).subscribe(
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

  getOrderById(id: string) {
    this.apiService.getOrderById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.dataDetail = response.data;
        }
      },
      error: (e) => { console.error(e) },
    })
  }

  getOrderDetailById(id: string) {
    this.apiService.getOrderById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.updateDataDetail = response.data;
          this.initailzeUpdateFormGroup();
        }
        this.router.navigate(["update-order", id], { relativeTo: this.activatedRoute });
      },
      error: (e) => { console.error(e) },
    })
  }

  updateOrderStatusById(id: string, status: string) {
    this.apiService.updateOrderStatusById(id, status).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          this.getOrdersList();
        }
      },
      error: (e) => { console.error(e) },
    })
  }


}

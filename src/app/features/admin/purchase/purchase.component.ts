import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TableComponent } from "../../../shared/components/table/table.component";
import { AddFormComponent } from "../../../shared/components/add-form/add-form.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [RouterModule, TableComponent, AddFormComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchasesComponent {

  //two way data binding variables
  private _dataDetailId: string = "";
  private _dataDetail: any = null;
  private _searchText: string = "";

  private updateDataDetailId: string = "";
  private updateDataDetail: any;
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

  set searchText(value: string) {
    this._searchText = value;
    this.onSearchTextChange();
  }
  //(end)---------------getters and setters for the two way binding variables------------


  searchSubject = new Subject<string>();
  isUpdatePurchaseOpen: Boolean = false;

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

  actionButtons: {expand: boolean, edit: boolean, delete: boolean} =  {
    expand: true,
    edit: true,
    delete: false
  }

  tableHeader: any[] = [
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Brand Name", class: "", sortBy: "brandName", sortDirection: "asc" },
    { name: "Purchased Date", class: "", sortBy: "createdAt", sortDirection: "asc" },
    { name: "Recorded By", class: "", sortBy: "recordedByUserId", sortDirection: "asc" },
    { name: "Status", class: "", sortBy: "status", sortDirection: "asc" },
  ]

  formConfig = [
    { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['VERIFIED', 'REJECTED', 'PENDING'] },
  ];


  expandDetail = [
    { key: 'purchaseId', label: 'Purchase ID' },
    { key: 'supplierId', label: 'Supplier ID' },
    { key: 'damagePercentage', label: 'Damage Percentage' },
    { key: 'status', label: 'Status' },
    { key: 'recordedByUserId', label: 'Recorded By User ID' },
    { key: 'approvedByUserId', label: 'Approved By User ID' },
    { key: 'createdAt', label: 'Created At' },
  ];

  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Update Purchase Status",
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
    this.getPurchasesList();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.getPurchasesList(undefined, undefined, undefined, undefined, searchTerm);
    });
    this.subscriveToRouteChange();
  }


  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getPurchasesList(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }


  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getPurchasesList(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    //do nothing
  }

  onDataDetailIdChange() {
    this.getPurchaseById(this.dataDetailId);
  }


  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  openAddPurchaseForm() {
    this.router.navigate(["add-purchase"], { relativeTo: this.activatedRoute });
  }


  subscriveToRouteChange() {
    if (this.router.url.startsWith("/admin/purchases/update-purchase")) {
      this.isUpdatePurchaseOpen = false;
      this.router.navigate(['/admin/purchases'])
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith("/admin/purchases/update-purchase")) {
          this.isUpdatePurchaseOpen = true;
        }
        else {
          this.isUpdatePurchaseOpen = false;
        }
      }
    })
  }



  //need to handle
  updateFormSubmit(event: any) {
    if(this.updateDataDetail.status == event.status) {
      console.log("No changes made");
      return;
    }
    console.log(event);
    if(this.updateDataDetail.status !== "VERIFIED" && event.status !== undefined) {
      this.updatePurchaseStatusById(event._id, event.status);
    }
    this.router.navigate(['/admin/purchases']);
  }


  updateFormDiscard() {
    this.updateDataDetail = null;
    this.updateDataDetailId = "";
    this.router.navigate(['/admin/purchases']);
  }




  updatePurchase(id: string) {
    this.updateDataDetailId = id;
    this.getPurchaseDetailById(id);
    setTimeout(() => {
      this.router.navigate(["update-purchase", id], { relativeTo: this.activatedRoute });
    }, 200)

  }

  initailzeUpdateFormGroup(isVerified: boolean = false) {
    this.updateDetailFormGroup = this.formBuilder.group({
      _id: this.updateDataDetailId,
      brandName: [{value: this.updateDataDetail.brandName, disabled: true}, Validators.required],
      status: [{value: this.updateDataDetail.status, disabled: isVerified}, [Validators.required, Validators.pattern('^(VERIFIED|REJECTED|PENDING)$')]],
    });
  }

  openCreatePurchaseForm() {
    this.router.navigate(["/admin/purchases/add-purchase"]);
  }

  //-----------------------------------------------------------------
  getPurchasesList(page: number = this.paging.page_number, size: number = this.paging.page_size, sortBy: string = "_id", sortDirection: string = "asc", search: string = "") {
    this.apiService.getPurchasesList(page, size, sortBy, sortDirection, search).subscribe(
      {
        next: (response: any) => {
          if (response.status === "success" && response.data) {
            console.log(response.data)
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

  getPurchaseById(id: string) {
    this.apiService.getPurchaseDetailById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.dataDetail = response.data;
          console.log(this.dataDetail);
        }
      },
      error: (e) => { console.error(e) },
    })
  }

  getPurchaseDetailById(id: string) {
    this.apiService.getPurchaseById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          console.log(response.data);
          this.updateDataDetail = response.data;
          const isVerified: boolean = this.updateDataDetail.status === "VERIFIED";
          this.initailzeUpdateFormGroup(isVerified);
        }
      },
      error: (e) => { console.error(e) },
    })
  }

  updatePurchaseStatusById(id: string, status: string) {
    this.apiService.updatePurchaseStatusById(id, status).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          this.getPurchasesList();
        }
      },
      error: (e) => { console.error(e) },
    })
  }


}

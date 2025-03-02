import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, FormsModule, AddFormComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
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
  isAddSupplierOpen: Boolean = false;
  isUpdateSupplierOpen: Boolean = false;

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
    { name: "Brand Name", class: "", sortBy: "brandName", sortDirection: "asc" },
    { name: "Phone", class: "", sortBy: "phone", sortDirection: "asc" },
  ]

  formConfig = [
    { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
    { key: 'contactPersonName', label: 'Contact Person Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text', required: true, validation: 'email' },
    { key: 'phone', label: 'Phone', type: 'text', required: true, validation: 'phone' },
    { key: 'address', label: 'Address', type: 'text', required: true },
  ];

  formUseAdd: { heading: string, submit: string, discard: string } =
    {
      heading: "Add Supplier",
      submit: "Submit",
      discard: "Discard"
    }

  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Update Supplier",
      submit: "Update",
      discard: "Discard"
    }

  displayData!: any[];


  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.getSuppliersList();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      console.log(searchTerm);
      this.getSuppliersList(undefined, undefined, undefined, undefined, searchTerm);
    });
    this.subscriveToRouteChange();
    this.initailizeFormGroup();
  }


  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getSuppliersList(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }


  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getSuppliersList(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    //do nothing
  }

  onDataDetailIdChange() {
    this.getSupplierById(this.dataDetailId);
  }


  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  openAddSupplierForm() {
    this.router.navigate(["add-supplier"], { relativeTo: this.activatedRoute });
  }

  subscriveToRouteChange() {
    if (this.router.url === "/admin/supplier/add-supplier") {
      this.isAddSupplierOpen = true;
      this.isUpdateSupplierOpen = false;
    }
    else if (this.router.url.startsWith("/admin/supplier/update-supplier")) {
      this.isUpdateSupplierOpen = false;
      this.isAddSupplierOpen = false;
      this.router.navigate(['/admin/supplier'])
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event.url === "/admin/supplier/add-supplier");
        if (event.url === "/admin/supplier/add-supplier") {
          this.isAddSupplierOpen = true;
          this.isUpdateSupplierOpen = false;
        }
        else if (event.url.startsWith("/admin/supplier/update-supplier")) {
          this.isUpdateSupplierOpen = true;
          this.isAddSupplierOpen = false;
        }
        else {
          this.isAddSupplierOpen = false;
          this.isUpdateSupplierOpen = false;
        }
      }
    })
  }


  //need to handle
  addFormSubmit(event: any) {
    console.log(event);
  }

  addFormDiscard() {
    this.router.navigate(['/admin/supplier'])
  }

  //need to handle
  updateFormSubmit(event: any) {
    console.log(event);
  }

  updateFormDiscard() {
    this.updateDataDetail = null;
    this.updateDataDetailId = "";
    this.router.navigate(['/admin/supplier']);
  }

  initailizeFormGroup() {
      this.formGroup = this.formBuilder.group({
        brandName: ['', Validators.required],
        contactPersonName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
        address: ['', Validators.required],
      });
    }

    updateSupplier(id: string) {
      this.updateDataDetailId = id;
      this.getSupplierDetailById(id);
      setTimeout(() => {
        this.router.navigate(["update-supplier", id],  { relativeTo: this.activatedRoute });
      }, 200)
  
    }

    initailzeUpdateFormGroup() {
      this.updateDetailFormGroup = this.formBuilder.group({
        _id: this.updateDataDetailId,
        brandName: [this.updateDataDetail.brandName, Validators.required],
        contactPersonName: [this.updateDataDetail.contactPersonName, Validators.required],
        email: [this.updateDataDetail.email, [Validators.required, Validators.email]],
        phone: [this.updateDataDetail.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
        address: [this.updateDataDetail.address, Validators.required],
      });
    }


    //------------------------------------------------------------------
  getSuppliersList(page: number = this.paging.page_number, size: number = this.paging.page_size, sortBy: string = "_id", sortDirection: string = "asc", search: string = "") {
    this.apiService.getSuppliersList(page, size, sortBy, sortDirection, search).subscribe(
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


  getSupplierById(id: string) {
    this.apiService.getSupplierById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.dataDetail = response.data;
        }
      },
      error: (e) => { console.error(e) },
    })
  }

  getSupplierDetailById(id: string) {
    this.apiService.getSupplierById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          console.log(response.data);
          this.updateDataDetail = response.data;
          this.initailzeUpdateFormGroup();
        }
      },
      error: (e) => { console.error(e) },
    })
  }









}

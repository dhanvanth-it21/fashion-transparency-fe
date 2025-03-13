import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";
import { ApiService } from '../../../shared/services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AddFormComponent } from "../../../shared/components/add-form/add-form.component";

@Component({
  selector: 'app-retail-shop',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, FormsModule, AddFormComponent],
  templateUrl: './retail-shop.component.html',
  styleUrl: './retail-shop.component.css'
})
export class RetailShopComponent {


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
  isAddRetailShopOpen: Boolean = false;
  isUpdateRetailShopOpen: Boolean = false;

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
    { name: "Shop Name", class: "", sortBy: "shopName", sortDirection: "asc" },
    { name: "Phone", class: "", sortBy: "phone", sortDirection: "asc" },
  ]

  formConfig = [
    { key: 'shopName', label: 'Shop Name', type: 'text', required: true },
    { key: 'contactPersonName', label: 'Contact Person Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text', required: true, validation: 'email' },
    { key: 'phone', label: 'Phone', type: 'text', required: true, validation: 'phone' },
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'creditNote', label: 'Credit Note (Rs.)', type: 'number', required: true, min: 0 }
  ];

  expandDetail = [
    { key: 'shopName', label: 'Shop Name' },
    { key: 'contactPersonName', label: 'Contact Person Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'creditNote', label: 'Credit Note (Rs.)' }
  ]

  formUseAdd: {heading: string, submit: string, discard: string} =
    {
      heading: "Add Retail Shop",
      submit: "Submit",
      discard: "Discard"
    }

  formUseUpdate: {heading: string, submit: string, discard: string} =
    {
      heading: "Update Retail Shop",
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
    this.getRetailShopsList();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.getRetailShopsList(undefined, undefined, undefined, undefined, searchTerm);
    });
    this.subscriveToRouteChange();
    this.initailizeFormGroup();
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


  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }


  openAddRetailShopForm() {
    this.router.navigate(["add-retail-shop"], { relativeTo: this.activatedRoute });
  }

  subscriveToRouteChange() {
    if (this.router.url === "/admin/retail-shop/add-retail-shop") {
      this.isAddRetailShopOpen = true;
      this.isUpdateRetailShopOpen = false;
    }
    else if (this.router.url.startsWith("/admin/retail-shop/update-retail-shop")) {
      this.isUpdateRetailShopOpen = false;
      this.isAddRetailShopOpen = false;
      this.router.navigate(['/admin/retail-shop'])
    }
    this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            if (event.url === "/admin/retail-shop/add-retail-shop") {
              this.isAddRetailShopOpen = true;
              this.isUpdateRetailShopOpen = false;
            }
            else if (event.url.startsWith("/admin/retail-shop/update-retail-shop")) {
              this.isUpdateRetailShopOpen = true;
              this.isAddRetailShopOpen = false;
            } 
            else {
              this.isAddRetailShopOpen = false;
              this.isUpdateRetailShopOpen = false;
            }
          }
        })
  }

  //need to handle
  addFormSubmit(value: any) {
    if(this.formGroup.valid){
      this.apiService.postNewRetailShop(value).subscribe({
        next: (response: any) => {
          //need to add sweet alert
          this.getRetailShopsList();
          this.router.navigate(['/admin/retail-shop'])
        },
        error: (e) => {
          //need to add sweet alert
          console.error(e)
        }
      })
    }
    else {
      //need to add sweet alter
    }
  }

  addFormDiscard() {
    this.router.navigate(['/admin/retail-shop'])
  }

  //need to handle
  updateFormSubmit(value: any) {
    if(this.updateDetailFormGroup.valid){
      this.apiService.updateRetailShopById(this.updateDataDetailId, value).subscribe({
        next: (response: any) => {
          //need to add sweet alert
          this.router.navigate(['/admin/retail-shop'])
        },
        error: (e) => {
          //need to add sweet alert
          console.error(e)
        }
      })
      
    }
    else{
      //need to add sweet alert
    }
  }

  updateFormDiscard() {
    this.updateDataDetail = null;
    this.updateDataDetailId = "";
    this.router.navigate(['/admin/retail-shop']);
  }


  initailizeFormGroup() {
    this.formGroup = this.formBuilder.group({
      shopName: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      address: ['', Validators.required],
      creditNote: [0, [Validators.required, Validators.min(0)]],
    });
  }

  updateRetailShop(id: string) {
    this.updateDataDetailId = id;
    this.getRetailShopDetailById(id);

  }

  initailzeUpdateFormGroup() {
    this.updateDetailFormGroup = this.formBuilder.group({
      _id: this.updateDataDetailId,
      shopName: [this.updateDataDetail.shopName, Validators.required],
      contactPersonName: [this.updateDataDetail.contactPersonName, Validators.required],
      email: [this.updateDataDetail.email, [Validators.required, Validators.email]],
      phone: [this.updateDataDetail.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      address: [this.updateDataDetail.address, Validators.required],
      creditNote: [this.updateDataDetail.creditNote, [Validators.required, Validators.min(0)]],
    });
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

  getRetailShopDetailById(id: string) {
    this.apiService.getRetailShopById(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.updateDataDetail = response.data;
          this.initailzeUpdateFormGroup();
          this.router.navigate(["update-retail-shop", id],  { relativeTo: this.activatedRoute });
        }
      },
      error: (e) => { console.error(e) },
    })
  }




}

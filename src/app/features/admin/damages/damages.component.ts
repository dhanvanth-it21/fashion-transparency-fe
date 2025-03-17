import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-damages',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, FormsModule, AddFormComponent],
  templateUrl: './damages.component.html',
  styleUrl: './damages.component.css'
})
export class DamagesComponent {

  moduleOf = "admin";

  // Two-way data binding variables
  private _dataDetailId: string = "";
  private _dataDetail: any = null;
  private _searchText: string = "";
  private _selectedFilter: string = '';



  private updateDataDetailId: string = "";
  private updateDataDetail: any;
  updateDetailFormGroup!: FormGroup;

  // (Start) Getters and setters for two-way binding variables
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

  get selectedFilter(): string {
    return this._selectedFilter;
  }

  set selectedFilter(value: string) {
    const allowedValues = ['UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    if (allowedValues.includes(value)) {
      this._selectedFilter = value;
    } else {
      this._selectedFilter = "";
    }
    this.getFilteredDamageList();

  }
  // (End) Getters and setters for two-way binding variables

  searchSubject = new Subject<string>();
  isAddDamageOpen: Boolean = false;
  isUpdateDamageOpen: Boolean = false;

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

  actionButtons: {expand: boolean, edit: boolean, delete: boolean, tracker: boolean} =  {
    expand: true,
    edit: true,
    delete: false,
    tracker: false,
  }

  tableHeader: any[] = [
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Tile SKU", class: "", sortBy: "skuCode", sortDirection: "asc" },
    { name: "Reported By", class: "", sortBy: "reportedBy", sortDirection: "asc" },
    { name: "Damage Location", class: "", sortBy: "damageLocation", sortDirection: "asc" },
    { name: "Quantity", class: "", sortBy: "qty", sortDirection: "asc" },
    { name: "Status", class: "", sortBy: "status", sortDirection: "asc" },
  ]

  formConfig = [
    { key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },
    { key: 'reportedBy', label: 'Reported By', type: 'text', required: true },
    { key: 'damageLocation', label: 'Damage Location', type: 'select', options: ['FROM_MANUFACTURER', 'AT_WAREHOUSE', 'TO_RETAIL_SHOP'], required: true },
    { key: 'qty', label: 'Quantity', type: 'number', required: true },
    { key: 'remark', label: 'Remark', type: 'text', required: true }
  ];

  updateFormConfig = [
    { key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },
    { key: 'qty', label: 'Quantity', type: 'number', required: true },
    { key: 'status', label: 'Damage Status', type: 'select', options: ['APPROVED', 'REJECTED'], required: true }
  ];

  expandDetail = [
    { key: 'skuCode', label: 'Tile SKU' },
    { key: 'reportedBy', label: 'Reported By' },
    { key: 'damageLocation', label: 'Damage Location' },
    { key: 'qty', label: 'Quantity' },
    { key: 'status', label: 'Status' },
    { key: 'remark', label: 'Remark' },
    { key: 'approvedBy', label: 'Approved by' },
    { key: 'purchaseId', label: 'Purchase Id' },
    { key: 'orderId', label: 'Order Id' },
    
    
  ]

  formUseAdd: { heading: string, submit: string, discard: string } =
    {
      heading: "Report Damage",
      submit: "Submit",
      discard: "Discard"
    }

  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Approve / Reject Damage",
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
    if (this.router.url.includes('employee')) {
      this.moduleOf = 'employee';
      this.actionButtons.edit = false;
    }
    else if (this.router.url.includes('admin')) {
      this.moduleOf = 'admin';
    }
    this.getDamageReports();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.getDamageReports(undefined, undefined, undefined, undefined, searchTerm);
    });
    this.subscribeToRouteChange();
    this.initializeFormGroup();
  }

  sortChanged(event: { sortBy: string, sortDirection: string }) {
    this.paging.sort_by = event.sortBy;
    this.getDamageReports(this.paging.page_number, this.paging.page_size, this.paging.sort_by, event.sortDirection);
  }

  pageChanged(page: number) {
    this.paging.page_number = page;
    this.getDamageReports(this.paging.page_number, this.paging.page_size);
  }

  onDataDetailChange() {
    // Do nothing
  }

  onDataDetailIdChange() {
    this.getDamageReportById(this.dataDetailId);


  }

  onSearchTextChange() {
    this.searchSubject.next(this.searchText);
  }

  openAddDamageForm() {
    this.router.navigate(["create-damage-report"], { relativeTo: this.activatedRoute });
  }

  subscribeToRouteChange() {
    if (this.router.url === `/${this.moduleOf}/damage-reports/create-damage-report`) {
      this.isAddDamageOpen = true;
      this.isUpdateDamageOpen = false;
    }
    else if (this.router.url.startsWith(`/${this.moduleOf}/damage-reports/update-damage-report`)) {
      this.isUpdateDamageOpen = false;
      this.isAddDamageOpen = false;
      this.router.navigate([`/${this.moduleOf}/damage-reports`])
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === `/${this.moduleOf}/damage-reports/create-damage-report`) {
          this.isAddDamageOpen = true;
          this.isUpdateDamageOpen = false;
        }
        else if (this.router.url.startsWith(`/${this.moduleOf}/damage-reports/update-damage-report`)) {
          this.isAddDamageOpen = false;
          this.isUpdateDamageOpen = true;
        }
        else {
          this.isAddDamageOpen = false;
          this.isUpdateDamageOpen = false;
        }
      }
    })
  }



  updateFormSubmit(value: any) {
    if (this.updateDetailFormGroup.get('status')?.value !== "UNDER_REVIEW") {
      this.router.navigate([`${this.moduleOf}/damage-reports`]);
    }
    if (this.updateDetailFormGroup.valid) {
      if (this.updateDetailFormGroup.get('status')?.value === "APPROVED") {
        this.apiService.approveDamageReport(this.updateDataDetailId).subscribe(
          {
            next: (response: any) => {
              console.log(response.data);
            },
            error: (e) => console.error(e)
          }
        );
      }
      else if (this.updateDetailFormGroup.get('status')?.value === "REJECTED") {
        this.apiService.rejectDamageReport(this.updateDataDetailId).subscribe(
          {
            next: (response: any) => {
              console.log(response.data); // need to add sweet alert
            },
            error: (e) => console.error(e)
          }
        );

      }
    }
  }

  updateFormDiscard() {
    this.updateDataDetail = null;
    this.updateDataDetailId = "";
    this.router.navigate([`/${this.moduleOf}/damage-reports`]);
  }

  updateDamage(id: any) {
    this.updateDataDetailId = id;
    this.getDamageStatusById(id);
    setTimeout(() => {
      this.router.navigate(["update-damage-report", id], { relativeTo: this.activatedRoute });
    }, 300)

  }

  initializeUpdateFormGroup() {
    this.updateDetailFormGroup = this.formBuilder.group({
      skuCode: [{ value: this.updateDataDetail.skuCode, disabled: true }, Validators.required],
      qty: [{ value: this.updateDataDetail.qty, disabled: true }, [Validators.required, Validators.min(1)]],
      status: [this.updateDataDetail.status, Validators.required]
    });

    if (this.updateDataDetail.status !== "UNDER_REVIEW") {
      this.updateDetailFormGroup.get('status')?.disable();
    }
  }

  initializeFormGroup() {
    this.formGroup = this.formBuilder.group({
      skuCode: ['', Validators.required],
      reportedByUserId: ['', Validators.required],
      damageLocation: ['', Validators.required],
      qty: ['', Validators.required],
      remark: ['']
    });
  }

  getDamageReports(page = this.paging.page_number, size = this.paging.page_size, sortBy = "_id", sortDirection = "asc", search = this.searchText) {
    this.apiService.getDamageReports(page, size, sortBy, sortDirection, search, this.selectedFilter).subscribe({
      next: (response: any) => {
        this.displayData = response.data;
        this.paging.is_first = response.metadata.isFirst;
        this.paging.is_last = response.metadata.isLast;
        this.paging.page_number = response.metadata.pageable.pageNumber;
        this.paging.page_size = response.metadata.pageable.pageSize;
        this.paging.total_elements = response.metadata.totalElements;
        this.paging.total_pages = response.metadata.totalPages;
      },
      error: (e) => console.error(e)
    });
  }

  getDamageReportById(id: string) {
    this.apiService.getDamageReportById(id).subscribe({
      next: (response: any) => {
        this.dataDetail = response.data;
      },
      error: (e) => console.error(e)
    });
  }

  getDamageStatusById(id: string) {
    this.apiService.getDamageStatusById(id).subscribe({
      next: (response: any) => {
        this.updateDataDetail = response.data;
        this.initializeUpdateFormGroup();
      },
      error: (e) => console.error(e)
    });
  }

  getFilteredDamageList() {
    this.getDamageReports();
  }

}

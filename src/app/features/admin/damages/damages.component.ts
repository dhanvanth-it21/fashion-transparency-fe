import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

   // Two-way data binding variables
   private _dataDetailId: string = "";
   private _dataDetail: any = null;
   private _searchText: string = "";
 
   private updateDataDetailId: string = "";
   private updateDataDetail: any;
   updateDetailFormGroup: FormGroup = new FormGroup([]);
 
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
 
   tableHeader: any[] = [
     { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
     { name: "Tile SKU", class: "", sortBy: "tileSku", sortDirection: "asc" },
     { name: "Reported By", class: "", sortBy: "reportedBy", sortDirection: "asc" },
     { name: "Damage Location", class: "", sortBy: "damageLocation", sortDirection: "asc" },
     { name: "Quantity", class: "", sortBy: "quantity", sortDirection: "asc" },
     { name: "Status", class: "", sortBy: "status", sortDirection: "asc" },
   ]
 
   formConfig = [
     { key: 'tileSku', label: 'Tile SKU', type: 'text', required: true },
     { key: 'reportedBy', label: 'Reported By', type: 'text', required: true },
     { key: 'damageLocation', label: 'Damage Location', type: 'select', options: ['FROM_MANUFACTURER', 'AT_WAREHOUSE', 'TO_RETAIL_SHOP'], required: true },
     { key: 'quantity', label: 'Quantity', type: 'number', required: true },
     { key: 'remark', label: 'Remark', type: 'text',required: true }
   ];
 
   expandDetail = [
     { key: 'tileSku', label: 'Tile SKU' },
     { key: 'reportedBy', label: 'Reported By' },
     { key: 'damageLocation', label: 'Damage Location' },
     { key: 'quantity', label: 'Quantity' },
     { key: 'status', label: 'Status' },
     { key: 'remark', label: 'Remark' },
   ]
 
   formUseAdd: { heading: string, submit: string, discard: string } =
     {
       heading: "Report Damage",
       submit: "Submit",
       discard: "Discard"
     }
 
   formUseUpdate: { heading: string, submit: string, discard: string } =
     {
       heading: "Approve/Reject Damage",
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
    if (this.router.url === "/admin/damage-reports/create-damage-report") {
      this.isAddDamageOpen = true;
      this.isUpdateDamageOpen = false;
    }
    else if (this.router.url.startsWith("/admin/damage-reports/update-supplier")) {
      this.isUpdateDamageOpen = false;
      this.isAddDamageOpen = false;
      this.router.navigate(['/admin/supplier'])
    }
     this.router.events.subscribe(event => {
       if (event instanceof NavigationEnd) {
         if (event.url === "/admin/damage-reports/create-damage-report") {
           this.isAddDamageOpen = true;
           this.isUpdateDamageOpen = false;
         } else {
           this.isAddDamageOpen = false;
           this.isUpdateDamageOpen = false;
         }
       }
     })
   }
 
   addFormSubmit(value: any) {
    console.log(value);
     if (this.formGroup.valid) {
      //  this.apiService.reportDamage(value).subscribe({
      //    next: () => {
      //      this.getDamageReports();
      //      this.router.navigate(['/admin/damage-reports']);
      //    },
      //    error: (e) => console.error(e)
      //  });
     }
   }
 
   addFormDiscard() {
     this.router.navigate(['/admin/damage-reports']);
   }
 
   updateFormSubmit(value: any) {
    console.log(value);
     if (this.updateDetailFormGroup.valid) {
      //  this.apiService.updateDamageStatus(this.updateDataDetailId, value).subscribe({
      //    next: () => {
      //      this.getDamageReports();
      //      this.router.navigate(['/admin/damage']);
      //    },
      //    error: (e) => console.error(e)
      //  });
     }
   }
 
   updateFormDiscard() {
     this.updateDataDetail = null;
     this.updateDataDetailId = "";
     this.router.navigate(['/admin/damage']);
   }

   updateDamage(value: any) {
    this.router.navigate(["update-damage-report"], { relativeTo: this.activatedRoute });
   }
 
   initializeFormGroup() {
     this.formGroup = this.formBuilder.group({
       tileSku: ['', Validators.required],
       reportedBy: ['', Validators.required],
       damageLocation: ['', Validators.required],
       quantity: ['', Validators.required],
       remark: ['']
     });
   }
 
   getDamageReports(page = this.paging.page_number, size = this.paging.page_size, sortBy = "_id", sortDirection = "asc", search = "") {
     this.apiService.getDamageReports(page, size, sortBy, sortDirection, search).subscribe({
       next: (response: any) => {
         this.displayData = response.data;
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

}

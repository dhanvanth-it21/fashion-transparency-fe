import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddFormComponent } from '../../../../shared/components/add-form/add-form.component';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-create-damage-report',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AddFormComponent],
  templateUrl: './create-damage-report.component.html',
  styleUrl: './create-damage-report.component.css'
})
export class CreateDamageReportComponent {
  private _searchTextOfTile: string = "";
  private _searchTextOfRetailShop: string = "";

  searchResultsOfTile: any[] = [];
  searchResultsOfRetailShop: any[] = [];

  get searchTextOfTile(): string {
    return this._searchTextOfTile;
  }

  set searchTextOfTile(value: string) {
    this._searchTextOfTile = value;
    if (this.searchTextOfTile !== "") {
      this.onSearchTextChangeOfTile();
    }
  }

  get searchTextOfRetailShop(): string {
    return this._searchTextOfRetailShop;
  }

  set searchTextOfRetailShop(value: string) {
    this._searchTextOfRetailShop = value;
    if (this.searchTextOfRetailShop !== "") {
      this.onSearchTextChangeOfRetailShop();
    }
  }

  formConfig = [
    { key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },
    { key: 'reportedByUserId', label: 'Reported By', type: 'text', required: true },
    { key: 'damageLocation', label: 'Damage Location', type: 'select', options: ['FROM_MANUFACTURER', 'AT_WAREHOUSE', 'TO_RETAIL_SHOP'], required: true },
    { key: 'qty', label: 'Quantity', type: 'number', required: true },
    { key: 'remark', label: 'Remark', type: 'text', required: true }
  ];

  formUseDamageReport = {
    heading: "Create New Damage Report",
    submit: "Submit",
    discard: "Cancel"
  };

  createDamageReportForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: ApiService, 
    private router: Router) {
    this.initializeForm();
  }

  initializeForm() {
    this.createDamageReportForm = this.formBuilder.group({
      skuCode: [{ value: '', disabled: true }, Validators.required],
      reportedByUserId: ['', Validators.required],
      damageLocation: ['', Validators.required],
      qty: [0, [Validators.required, Validators.min(1)]],
      remark: ['', Validators.required],
      retailShop: [{ value: '', disabled: true }]
    });

    this.createDamageReportForm.get('damageLocation')?.valueChanges.subscribe((location) => {
      const retailShopControl = this.createDamageReportForm.get('retailShop');
      if (location === 'TO_RETAIL_SHOP') {

        this.formConfig.push({ key: 'retailShop', label: 'Retail Shop', type: 'text', required: true });
      } else {

        this.formConfig = this.formConfig.filter((field) => field.key !== 'retailShop');
      }
    });
  }

  onSearchTextChangeOfTile() {
    this.apiService.getTiles(this.searchTextOfTile).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfTile = response.data;
        }
      },
      error: (e) => console.error(e),
    });
  }

  onSearchTextChangeOfRetailShop() {
    this.apiService.getShops(this.searchTextOfRetailShop).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfRetailShop = response.data;
        }
      },
      error: (e) => console.error(e),
    });
  }

  selectTile(tile: any) {
    this.createDamageReportForm.patchValue({
      skuCode: tile.skuCode
    });
    this.searchResultsOfTile = [];
    this.searchTextOfTile = "";
  }

  selectRetailShop(shop: any) {
    this.createDamageReportForm.patchValue({
      retailShop: shop.shopName
    });
    this.searchResultsOfRetailShop = [];
    this.searchTextOfRetailShop = "";
  }

  submitDamageReport() {
    console.log("jhfjkhsdjkfhsd");
    // this.apiService.postDamageReport(this.createDamageReportForm.value).subscribe({
    //   next: (response: any) => console.log(response.data),
    //   error: (e) => console.error(e),
    // });
    // this.router.navigate(['/admin/damage-reports']);
  }

  closeForm() {
    this.router.navigate(['/admin/damage-reports']);
  }

}

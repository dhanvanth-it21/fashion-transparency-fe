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


 searchSkucode: boolean = false;


  private _searchTextOfTile: string = "";
  private _searchTextOfRetailShop: string = "";
  private _searchTextOfManufacturer: string = "";

  searchResultsOfTile: any[] = [];
  searchResultsOfRetailShop: any[] = [];
  searchResultsOfManufacturer: any[] = [];

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

  get searchTextOfManufacturer(): string {
    return this._searchTextOfManufacturer;
  }
  
  set searchTextOfManufacturer(value: string) {
    this._searchTextOfManufacturer = value;
    if (this.searchTextOfManufacturer !== "") {
      this.onSearchTextChangeOfManufacturer();
    }
  }

  formConfig = [

    { key: 'damageLocation', label: 'Damage Location', type: 'select', options: ['FROM_MANUFACTURER', 'AT_WAREHOUSE', 'TO_RETAIL_SHOP'], required: true },
    { key: 'qty', label: 'Quantity', type: 'number', required: true },
    { key: 'remark', label: 'Remark', type: 'text', required: true },
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
      soldQty: [{ value: "", disabled: true }, Validators.required],
      purchasedQty: [{ value: "", disabled: true }, Validators.required],
      availableQty: [{ value: "", disabled: true }, Validators.required],
      damageLocation: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      remark: ['', Validators.required],
      retailShopId: [''],
      supplierId: [''],
      purchaseId: [{ value: '', disabled: true }, Validators.required],
      orderId: [{ value: '', disabled: true }, Validators.required],
      shopName: [{ value: '', disabled: true }, Validators.required],
      brandName: [{ value: '', disabled: true }, Validators.required],
    });

    this.createDamageReportForm.get('damageLocation')?.valueChanges.subscribe((location) => {
      this.updateFormFields(location);
    });
  }

  updateFormFields(location: string) {
    this.searchSkucode = false;

    // this.initializeForm()
    this.formConfig = this.formConfig.filter(field => ['damageLocation', 'qty', 'remark'].includes(field.key));

    if (location === 'FROM_MANUFACTURER') {
      this.formConfig.push({ key: 'purchaseId', label: 'Purchase ID', type: 'text', required: true });
      this.formConfig.push({ key: 'brandName', label: 'Brand Name', type: 'text', required: true });
    } else if (location === 'TO_RETAIL_SHOP') {
      this.formConfig.push({ key: 'orderId', label: 'Order ID', type: 'text', required: true });
      this.formConfig.push({ key: 'shopName', label: 'Shop Name', type: 'text', required: true });

    }
    else {
      this.formConfig.push({ key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },);
      this.formConfig.push({ key: 'availableQty', label: 'Available Qty', type: 'number', required: true },);
      this.searchSkucode = true;
    }
  }

  onSearchTextChangeOfTile() {
    const location = this.createDamageReportForm.get('damageLocation')?.value;
    const givenId = this.createDamageReportForm.get('purchaseId')?.value ||
      this.createDamageReportForm.get('orderId')?.value
      ;
    this.apiService.getTiles(this.searchTextOfTile, location, givenId).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfTile = response.data;
        }
      },
      error: (e) => console.error(e),
    });
  }

  onSearchTextChangeOfRetailShop() {
    this.apiService.getShopsFromOrder(this.searchTextOfRetailShop).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfRetailShop = response.data;
        }
      },
      error: (e) => console.error(e),
    });
  }

  onSearchTextChangeOfManufacturer() {
    this.apiService.getManufacturers(this.searchTextOfManufacturer).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfManufacturer = response.data;
        }
      },
      error: (e) => console.error(e),
    });
  }

  selectTile(tile: any) {
    
    this.createDamageReportForm.patchValue({
      skuCode: tile.skuCode,
      availableQty: tile.qty,
      purchasedQty: tile.qty,
      soldQty: tile.qty,
    });
    const availableQty = tile.qty;
    this.createDamageReportForm.get('qty')?.setValidators([Validators.required, Validators.min(1), Validators.max(availableQty)]);
    this.createDamageReportForm.get('qty')?.updateValueAndValidity();
    this.searchResultsOfTile = [];
    this.searchTextOfTile = "";
   
  }

  selectRetailShop(shop: any) {
    this.createDamageReportForm.patchValue({
      shopName: shop.shopName,
      // retailShopId: shop._id,
      orderId: shop.orderId,
    });
    this.searchResultsOfRetailShop = [];
    this.searchTextOfRetailShop = "";
    this.updateFormFields('TO_RETAIL_SHOP');
    this.formConfig.push({ key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },);
    this.formConfig.push({ key: 'soldQty', label: 'Sold Qty', type: 'number', required: true });
    this.searchSkucode = true;
  }

  selectManufacturer(manufacturer: any) {
    
    this.createDamageReportForm.patchValue({
      supplierId: manufacturer.supplierId,
      purchaseId: manufacturer.purchaseId,
      brandName: manufacturer.brandName,

    });
    this.searchResultsOfManufacturer = [];
    this.searchTextOfManufacturer = "";
    this.updateFormFields('FROM_MANUFACTURER');
    this.formConfig.push({ key: 'skuCode', label: 'Tile SKU', type: 'text', required: true },);
    this.formConfig.push({ key: 'soldQty', label: 'Sold Qty', type: 'number', required: true });
    this.searchSkucode = true;
  }

  submitDamageReport() {
    this.createDamageReportForm.get('skuCode')?.enable();
    this.createDamageReportForm.get('orderId')?.enable();
    this.createDamageReportForm.get('purchaseId')?.enable();
    this.apiService.postDamageReport(this.createDamageReportForm.value).subscribe({
      next: (response: any) => console.log(response.data), //need to add sweet alert
      error: (e) => console.error(e),
    });
    this.router.navigate(['/admin/damage-reports']);
  }

  closeForm() {
    this.router.navigate(['/admin/damage-reports']);
  }


}

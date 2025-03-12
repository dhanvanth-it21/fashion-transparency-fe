import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddFormComponent } from "../../../../shared/components/add-form/add-form.component";
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TableComponent } from "../../../../shared/components/table/table.component";

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddFormComponent, TableComponent],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  createOrderForm!: FormGroup;
  itemList!: FormArray;

  searchResultsOfShopName: any[] = [];
  searchResultsOfTile: any[] = [];


  isUpdateSupplierOpen: Boolean = false;
  updateDetailFormGroup!: FormGroup;
  // setQtyFormGroup!: FormGroup;

  private _searchTextOfShopName: string = "";
  get searchTextOfShopName(): string {
    return this._searchTextOfShopName;
  }

  set searchTextOfShopName(value: string) {
    this._searchTextOfShopName = value;
    if (this.searchTextOfShopName !== "") {
      this.onSearchTextChangeOfShopName();
    }
  }

  private _searchTextOfTile: string = "";
  get searchTextOfTile(): string {
    return this._searchTextOfTile;
  }

  set searchTextOfTile(value: string) {
    this._searchTextOfTile = value;
    if (this.searchTextOfTile !== "") {
      this.onSearchTextChangeOfTile();
    }
  }



  searchSubjectOfShopName = new Subject<string>();
  searchSubjectOfTile = new Subject<string>();


  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Update Qty",
      submit: "Update",
      discard: "Discard"
    }

  formConfig = [
    { key: 'shopName', label: 'Shop Name', type: 'text', required: true },
    { key: 'salesId', label: 'Sales ID', type: 'text', required: true },
    { key: 'damagePercentage', label: 'Damage %', type: 'number', required: true, min: 0, max: 100 }
  ];

  formConfigOfUpdate = [
    { key: "skuCode", label: "Sku Code", type: "text", required: true },
    { key: "qty", label: "Qty", type: "number", required: true, min: 1 },
    { key: "requiredQty", label: "Required Qty", type: "number", required: true, min: 1 },
  ];

  formUseOrder: { heading: string, submit: string, discard: string } =
    {
      heading: "Order Form",
      submit: "Create",
      discard: "Discard"
    }


  paging = {
    page_number: 0,
    page_size: 20,
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

  allowPagination: {isPaginated: boolean, pageSize: boolean} = {
    isPaginated: true,
    pageSize: true,
  }

  displayData: { _id: string, skuCode: string, qty: number, requiredQty: number }[] = [];

  tableHeader: any[] = [
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Sku Code", class: "", sortBy: "skuCode", sortDirection: "asc" },
    { name: "Availabel Qty", class: "", sortBy: "qty", sortDirection: "asc" },
    { name: "Required Qty", class: "", sortBy: "requiredQty", sortDirection: "asc" },
  ]

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.searchSubjectOfShopName
      .pipe(debounceTime(500))
      .subscribe((searchTerm) => {
        this.searchForShopName(searchTerm);
      });
    this.searchSubjectOfTile
      .pipe(debounceTime(500))
      .subscribe((searchTerm) => {
        this.searchForTile(searchTerm);
      });
  }

  initializeForm() {
    this.createOrderForm = this.formBuilder.group({
      salesId: [this.generateSalesID(), Validators.required],
      shopId: ['', Validators.required],
      shopName: [{ value: '', disabled: true }, Validators.required],
      damagePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      itemList: this.formBuilder.array([], Validators.minLength(1)),
    });

    this.itemList = this.createOrderForm.controls['itemList'] as FormArray;
  }



  searchForShopName(searchTerm: string) {
    this.apiService.getShops(searchTerm).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfShopName = response.data;
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  searchForTile(searchTerm: string) {
    this.apiService.getTiles(searchTerm).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfTile = response.data;
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  onSearchTextChangeOfShopName() {
    this.searchSubjectOfShopName.next(this.searchTextOfShopName);
  }

  onSearchTextChangeOfTile() {
    this.searchSubjectOfTile.next(this.searchTextOfTile);
  }


  selectShop(shop: any) {
    this.createOrderForm.patchValue({
      shopId: shop._id,
      shopName: shop.shopName
    });
    this.searchResultsOfShopName = [];
    this.searchTextOfShopName = "";
  }
  selectTile(tile: any) {
    if (this.checkDuplicate(tile.skuCode)) {
      this.searchResultsOfTile = [];
      this.searchTextOfTile = "";
      return;
    }
    this.displayData.push({ _id: tile._id, skuCode: tile.skuCode, qty:tile.qty, requiredQty: 1 });
    this.itemList.push(
      this.formBuilder.group({
        tileId: [tile._id, Validators.required],
        skuCode: [{ value: tile.skuCode, disabled: true}],
        qty: [{ value: tile.qty, disabled: true }, [Validators.required, Validators.min(0)]],
        requiredQty: [1, [Validators.required, Validators.min(1), Validators.max(tile.qty)]]
      })
    );
    this.searchResultsOfTile = [];
    this.searchTextOfTile = "";
  }

  submitOrder() {
    console.log(this.createOrderForm.value)
    this.apiService.postNewOrder(this.createOrderForm.value).subscribe({
      next: (repsonse: any) => {console.log(repsonse.data)},
      error: e => console.error(e),
    })
    this.router.navigate(['/admin/orders']);
  }

  closeForm() {
    this.router.navigate(['/admin/orders']);
  }

  checkDuplicate(skuCode: string): boolean {
    if (this.displayData.find(item => {
      return item.skuCode === skuCode;
    })) return true;
    return false;
  }

  updateTileQty(id: string) {

    const item = this.itemList.controls.find(item =>
      item.value.tileId === id || item.value._id === id
    ) as FormGroup;
    console.log(item);

    this.updateDetailFormGroup = item;
    this.isUpdateSupplierOpen = true;
  }

  submitUpdate(event: any) {

    const displayItem = this.displayData.find(item => item._id === event.tileId);
    if (displayItem) {
      displayItem.requiredQty = event.requiredQty;
    }
    this.isUpdateSupplierOpen = false;
  }

  closeUpdateForm() {
    this.isUpdateSupplierOpen = false;
  }

  
  generateSalesID() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10).split('-').join("");
    const formattedTime = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    return `SALES-${formattedDate}-${formattedTime}`;
  }
}


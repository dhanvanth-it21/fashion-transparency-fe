import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddFormComponent } from "../../../../shared/components/add-form/add-form.component";
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TableComponent } from "../../../../shared/components/table/table.component";

@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddFormComponent, TableComponent],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.css'
})
export class CreatePurchaseComponent {

  createPurchaseForm!: FormGroup;
  itemList!: FormArray;

  searchResultsOfBrandName: any[] = [];
  searchResultsOfTile: any[] = [];


  isUpdateSupplierOpen: Boolean = false;
  updateDetailFormGroup!: FormGroup;


  private _searchTextOfBrandName: string = "";
  get searchTextOfBrandName(): string {
    return this._searchTextOfBrandName;
  }

  set searchTextOfBrandName(value: string) {
    this._searchTextOfBrandName = value;
    if (this.searchTextOfBrandName !== "") {
      this.onSearchTextChangeOfBrandName();
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



  searchSubjectOfBrandName = new Subject<string>();
  searchSubjectOfTile = new Subject<string>();


  actionButtons: {expand: boolean, edit: boolean, delete: boolean} =  {
    expand: true,
    edit: true,
    delete: false
  }

  formUseUpdate: { heading: string, submit: string, discard: string } =
    {
      heading: "Update Qty",
      submit: "Update",
      discard: "Discard"
    }

  formConfig = [
    { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
    { key: 'purchaseId', label: 'Purchase ID', type: 'text', required: true },
    { key: 'damagePercentage', label: 'Damage %', type: 'number', required: true, min: 0, max: 100 }
  ];

  // 67bbfe2f8d85f862f666bb10

  formConfigOfUpdate = [
    { key: "skuCode", label: "Sku Code", type: "text", required: true },
    { key: "qty", label: "Qty", type: "number", required: true, min: 1 },
    { key: "addQty", label: "Add Qty", type: "number", required: true, min: 0 },
  ];

  formUsePurchase: { heading: string, submit: string, discard: string } =
    {
      heading: "Purchase Form",
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

  allowPagination: {isPaginated: boolean, pageSize: boolean} = {
    isPaginated: true,
    pageSize: true,
  }

  displayData: { _id: string, skuCode: string, qty: number, addQty: number }[] = [];

  tableHeader: any[] = [
    { name: "S No.", class: "", sortBy: "_id", sortDirection: "asc" },
    { name: "Sku Code", class: "", sortBy: "skuCode", sortDirection: "asc" },
    { name: "Available Qty", class: "", sortBy: "qty", sortDirection: "asc" },
    { name: "Add Qty", class: "", sortBy: "addQty", sortDirection: "asc" },
  ]

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.searchSubjectOfBrandName
      .pipe(debounceTime(500))
      .subscribe((searchTerm) => {
        this.searchForBrandName(searchTerm);
      });
    this.searchSubjectOfTile
      .pipe(debounceTime(500))
      .subscribe((searchTerm) => {
        this.searchForTile(searchTerm);
      });
  }

  initializeForm() {
    this.createPurchaseForm = this.formBuilder.group({
      purchaseId: [this.generatePurchaseID(), Validators.required],
      addQty: [0, [Validators.required, Validators.min(0)]],
      recordedByUserId: ['67bbfe2f8d85f862f666bb10', Validators.required],
      supplierId: ['', Validators.required],
      brandName: [{ value: '', disabled: true }, Validators.required],
      damagePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      itemList: this.formBuilder.array([])
    });

    this.itemList = this.createPurchaseForm.controls['itemList'] as FormArray;
  }



  searchForBrandName(searchTerm: string) {
    this.apiService.getSuppliers(searchTerm).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.searchResultsOfBrandName = response.data;
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

  onSearchTextChangeOfBrandName() {
    this.searchSubjectOfBrandName.next(this.searchTextOfBrandName);
  }

  onSearchTextChangeOfTile() {
    this.searchSubjectOfTile.next(this.searchTextOfTile);
  }


  selectSupplier(supplier: any) {
    this.createPurchaseForm.patchValue({
      supplierId: supplier._id,
      brandName: supplier.brandName
    });
    this.searchResultsOfBrandName = [];
    this.searchTextOfBrandName = "";
  }
  selectTile(tile: any) {
    if (this.checkDuplicate(tile.skuCode)) {
      this.searchResultsOfTile = [];
      this.searchTextOfTile = "";
      return;
    }
    this.displayData.push({ _id: tile._id, skuCode: tile.skuCode, qty:tile.qty, addQty: 1 });
    this.itemList.push(
      this.formBuilder.group({
        tileId: [tile._id, Validators.required],
        skuCode: [{ value: tile.skuCode, disabled: true}],
        qty: [{ value: tile.qty, disabled: true }, [Validators.required, Validators.min(0)]],
        addQty: [1, [Validators.required, Validators.min(1)]]
      })
    );
    this.searchResultsOfTile = [];
    this.searchTextOfTile = "";
  }

  submitPurchase() {
    console.log(this.createPurchaseForm.value)
    this.apiService.postNewPurchase(this.createPurchaseForm.value).subscribe({
      next: (repsonse: any) => {console.log(repsonse.data)},
      error: e => console.error(e),
    })
    this.router.navigate(['/admin/purchases']);
  }

  closeForm() {
    this.router.navigate(['/admin/purchases']);
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
      displayItem.addQty = event.addQty;
    }
    this.isUpdateSupplierOpen = false;
  }

  closeUpdateForm() {
    this.isUpdateSupplierOpen = false;
  }

  generatePurchaseID() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10).split('-').join("");
    const formattedTime = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    return `PUR-${formattedDate}-${formattedTime}`;
  }


}





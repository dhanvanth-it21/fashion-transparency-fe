import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AddTileComponent } from "./add-tile/add-tile.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { faArchive, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faEdit, faExpand, faL, faUpDown, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Tile, TileDetial } from '../models/tile.modle';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UpdateTileComponent } from "./update-tile/update-tile.component";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AddFormComponent } from "../../../shared/components/add-form/add-form.component";


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    RouterModule,
    // AddTileComponent, 
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    UpdateTileComponent,
    AddFormComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

  moduleOf = "admin";


  private _lowStockFilter: boolean = false;

  get lowStockFilter(): boolean {
    return this._lowStockFilter;
  }

  set lowStockFilter(value: boolean) {
    this._lowStockFilter = value;
    this.updateTileTable();
  }



  isAddTileComponentOpen: Boolean = false;
  isUpdateTileComponentOpen: Boolean = false;

  iconsUsed = {
    update: faEdit,
    archive: faArchive,
    details: faExpand,
    prev: faArrowLeft,
    next: faArrowRight,
    asc: faArrowDown,
    desc: faArrowUp,

  }

  paging = {
    page_number: 0,
    page_size: 8,
    total_pages: 1,
    is_first: true,
    is_last: true,
    total_elements: 0,
    sort_by: "_id",
  }


  tabelHeader = [
    { name: "S No.", class: "make-center", sortBy: "_id", sortDirection: "asc" },
    { name: "Sku Code", class: "", sortBy: "skuCode", sortDirection: "asc" },
    { name: "Tile Size", class: "", sortBy: "tileSize", sortDirection: "asc" },
    { name: "Brand Name", class: "", sortBy: "brandName", sortDirection: "asc" },
    { name: "Model Name", class: "", sortBy: "modelName", sortDirection: "asc" },
    { name: "Qty", class: "make-center", sortBy: "qty", sortDirection: "asc" },
    { name: "Pieces / Box", class: "make-center", sortBy: "piecesPerBox", sortDirection: "asc" },
    { name: "Action", class: "" },
  ]




  displayData!: Tile[];

  tileDetail: TileDetial | null = null;
  tileDetailId: string | null = null;

  updatingTileId!: string;

  searchText: string = "";
  searchSubject = new Subject<string>();


  newAddTileFormBuilder!: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    if (this.router.url.includes('employee')) {
      this.moduleOf = 'employee';
    }
    else if (this.router.url.includes('admin')) {
      this.moduleOf = 'admin';
    }


    this.getTilesList(this.paging.page_number, this.paging.page_size);


    if (this.router.url === `/${this.moduleOf}/inventory/add-tile`) {
      this.isAddTileComponentOpen = false;
      this.router.navigate([`/${this.moduleOf}/inventory`]);
    }
    else if (this.router.url.startsWith( `/${this.moduleOf}/inventory/update-tile `)) {
      this.isUpdateTileComponentOpen = true;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === `/${this.moduleOf}/inventory/add-tile`) {
          this.initializeFormGroup()
          this.isAddTileComponentOpen = true;
          this.isUpdateTileComponentOpen = false;
        }
        else if (event.url.startsWith(`/${this.moduleOf}/inventory/update-tile`)) {
          this.isUpdateTileComponentOpen = true;
          this.isAddTileComponentOpen = false;
        }
        else {
          this.isAddTileComponentOpen = false;
          this.isUpdateTileComponentOpen = false;
        }
      }
    })

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.updateTileTable(undefined, undefined, searchTerm);
    });
  }

  formUseAdd: { heading: string, submit: string, discard: string } =
    {
      heading: "Add New Tile",
      submit: "Submit",
      discard: "Discard"
    }





  openAddTileComponent() {
    this.router.navigate(["add-tile"], { relativeTo: this.activatedRoute });
  }

  closeAddTileComponent() {
    this.router.navigate([`/${this.moduleOf}/inventory`]);
  }


  openUpdateTileComponent(id: string) {
    this.updatingTileId = id;
    this.router.navigate(["update-tile", id], { relativeTo: this.activatedRoute });
  }

  closeUpdateTileComponent() {
    this.router.navigate([`/${this.moduleOf}/inventory`]);
  }

  searchBy() {
    this.searchSubject.next(this.searchText);
  }



  getTilesList(page: number, size: number, sortBy: string = this.paging.sort_by, sortDirection: string = "asc", search: string = this.searchText) {
    this.apiService.getTilesList(page, size, sortBy, sortDirection, search, this.lowStockFilter).subscribe(
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

  getTileDetail(id: string) {
    this.apiService.getTileDetail(id).subscribe({
      next: (response: any) => {
        if (response.status === "success" && response.data) {
          this.tileDetail = response.data;
        }
      },
      error: (e) => { console.error(e) },
    })
  }



  showDetailsOfTileId(_id: string) {
    if (this.tileDetailId === _id) {
      this.tileDetailId = null;
      this.tileDetail = null;
      return;
    }
    this.tileDetailId = _id;
    this.tileDetail = this.getTileDetail(_id)!;
  }

  previousPage() {
    if (!this.paging.is_first) {
      this.paging.page_number = this.paging.page_number - 1;
      this.updateTileTable();
    }
  }

  nextPage() {
    if (!this.paging.is_last) {
      this.paging.page_number = this.paging.page_number + 1;
      this.updateTileTable();
    }
  }

  updateTileTable(sortBy: string = "", sortDirection: string = "asc", search: string = this.searchText) {
    if (sortBy === "") {
      this.getTilesList(this.paging.page_number, this.paging.page_size, undefined, undefined, search);
    }
    else {
      this.getTilesList(this.paging.page_number, this.paging.page_size, sortBy, sortDirection, search);
    }
  }

  updatePaging() {
    this.paging.page_number = 0;
    this.updateTileTable();
  }



  doSorting(sortBy: string, sortDirection: string) {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    this.tabelHeader.filter((data) => {
      data.sortBy === sortBy;
      data.sortDirection = direction;
    })
    this.updateTileTable(sortBy, direction);
  }

  updateTileDetails(id: string) {
    this.updatingTileId = id;
  }











  subCategoryOptions: { [key: string]: string[] } = {
    WALL: ['KITCHEN', 'BATHROOM', 'ELEVATION'],
    FLOOR: ['INDOOR', 'PARKING', 'ROOFING'],
  };




  tileFormConfig = [
    { key: 'modelName', label: 'Model Name', type: 'text', required: true },
    { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
    { key: 'tileSize', label: 'Tile Size', type: 'select', required: true, options: ['SIZE_1X1', 'SIZE_1_5X1', 'SIZE_2X1', 'SIZE_2X2', 'SIZE_3X3', 'SIZE_4X2', 'SIZE_4X4', 'SIZE_6X4', 'SIZE_8X4'] },
    { key: 'qty', label: 'Quantity', type: 'number', required: true, min: 1 },
    { key: 'piecesPerBox', label: 'Pieces Per Box', type: 'number', required: true, min: 1 },
    { key: 'color', label: 'Colour', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'select', required: true, options: ['WALL', 'FLOOR'] },
    { key: 'subCategory', label: 'SubCategory', type: 'select', required: true, options: [] },
    { key: 'finishing', label: 'Finishing', type: 'select', required: true, options: ['GLOSSY', 'HIGH_GLOSSY', 'MATT', 'SUGAR', 'CARVING', 'FULL_BODY'] },
    { key: 'minimumStockLevel', label: 'Minimum Stock Level', type: 'number', required: true, min: 10 },
  ];


  initializeFormGroup() {
    this.newAddTileFormBuilder = this.formBuilder.group({
      modelName: ['', Validators.required],
      brandName: ['', Validators.required],
      tileSize: ['', Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]],
      piecesPerBox: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      category: ['', [Validators.required]],
      subCategory: ['', [Validators.required]],
      finishing: ['', [Validators.required]],
      minimumStockLevel: [null, [Validators.required, Validators.min(10)]],
    });


    this.newAddTileFormBuilder.get('category')?.valueChanges.subscribe((selectedCategory) => {
      this.updateSubCategoryOptions(selectedCategory);
    });

    const initialCategory = this.newAddTileFormBuilder.get('category')?.value;
    this.updateSubCategoryOptions(initialCategory);
  }


  updateSubCategoryOptions(selectedCategory: string) {
    const subCategoryField = this.tileFormConfig.find(field => field.key === 'subCategory');

    if (subCategoryField) {
      subCategoryField.options = this.subCategoryOptions[selectedCategory] || [];
    }

    this.newAddTileFormBuilder.get('subCategory')?.setValue('');
  }




  handleTileSubmit(formData: any) {
    if (this.newAddTileFormBuilder.valid) {
      this.router.navigate([`/${this.moduleOf}/inventory`])
    }
  }

  closeDialog() {
    this.router.navigate([`/${this.moduleOf}/inventory`])
  }

}

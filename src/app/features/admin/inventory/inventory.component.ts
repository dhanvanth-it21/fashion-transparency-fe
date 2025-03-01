import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AddTileComponent } from "./add-tile/add-tile.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { faArchive, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faEdit, faExpand, faUpDown, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Tile, TileDetial } from '../models/tile.modle';
import { FormsModule } from '@angular/forms';
import { UpdateTileComponent } from "./update-tile/update-tile.component";


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterModule, AddTileComponent, CommonModule, FontAwesomeModule, FormsModule, UpdateTileComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {


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
    {name: "S No.", class: "make-center", sortBy: "_id", sortDirection: "asc"},
    {name: "Sku Code", class: "", sortBy: "skuCode", sortDirection: "asc"},
    {name: "Tile Size", class: "", sortBy: "tileSize", sortDirection: "asc"},
    {name: "Brand Name", class: "", sortBy: "brandName", sortDirection: "asc"},
    {name: "Model Name", class: "", sortBy: "modelName", sortDirection: "asc"},
    {name: "Qty", class: "make-center", sortBy: "qty", sortDirection: "asc"},
    {name: "Pieces / Box", class: "make-center", sortBy: "piecesPerBox", sortDirection: "asc"},
    {name: "Action", class: ""},
  ]

  displayData!: Tile[];

  tileDetail: TileDetial | null= null;
  tileDetailId: string | null = null;

  updatingTileId!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) { }

  ngOnInit() {


    this.getTilesList(this.paging.page_number, this.paging.page_size);


    if (this.router.url === "/admin/inventory/add-tile") {
      this.isAddTileComponentOpen = true;
    }
    else if(this.router.url.startsWith("/admin/inventory/update-tile")) {
      this.isUpdateTileComponentOpen = true;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === "/admin/inventory/add-tile") {
          this.isAddTileComponentOpen = true;
          this.isUpdateTileComponentOpen = false;
        }
        else if (event.url.startsWith("/admin/inventory/update-tile")) {
          this.isUpdateTileComponentOpen = true;
          this.isAddTileComponentOpen = false;
        }
        else {
          this.isAddTileComponentOpen = false;
          this.isUpdateTileComponentOpen = false;
        }
      }
    })
  }





  openAddTileComponent() {
    this.router.navigate(["add-tile"], { relativeTo: this.activatedRoute });
  }

  closeAddTileComponent() {
    this.router.navigate(["/admin/inventory"]);
  }


  openUpdateTileComponent(id: string) {
    this.updatingTileId = id;
    this.router.navigate(["update-tile", id], { relativeTo: this.activatedRoute });
  }

  closeUpdateTileComponent() {
    this.router.navigate(["/admin/inventory"]);
  }



  getTilesList(page: number, size: number, sortBy: string = this.paging.sort_by, sortDirection: string = "asc") {
    this.apiService.getTilesList(page, size, sortBy, sortDirection).subscribe(
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
    if(this.tileDetailId === _id) {
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

  updateTileTable(sortBy: string =  "", sortDirection: string = "asc") {
    if(sortBy === "") {
      this.getTilesList(this.paging.page_number, this.paging.page_size);
    }
    else {
      this.getTilesList(this.paging.page_number, this.paging.page_size, sortBy, sortDirection);
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



}

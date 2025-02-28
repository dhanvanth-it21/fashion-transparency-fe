import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AddTileComponent } from "./add-tile/add-tile.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { faArchive, faArrowLeft, faArrowRight, faEdit, faExpand, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Tile } from '../models/tile.modle';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterModule, AddTileComponent, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {


  isAddTileComponentOpen: Boolean = false;

  iconsUsed = {
    update: faEdit,
    archive: faArchive,
    details: faExpand,
    prev: faArrowLeft,
    next: faArrowRight,

  }

  paging = {
    page_number: 0,
    page_size: 8,
    total_pages: 1,
    is_first: true,
    is_last: true,
    total_elements: 0,
  }


  displayData!: Tile[];

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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === "/admin/inventory/add-tile") {
          this.isAddTileComponentOpen = true;
        }
        else {
          this.isAddTileComponentOpen = false;
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

  getTilesList(page: number, size: number) {
    this.apiService.getTilesList(page, size).subscribe(
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



  showDetailsOfTileId(_id: string) {
    console.log(_id)
  }

  previousPage() {
    if(!this.paging.is_first) {
      this.paging.page_number = this.paging.page_number - 1;
      this.updateTileTable();
    }
  }

  nextPage() {
    if(!this.paging.is_last) {
      this.paging.page_number = this.paging.page_number + 1;
      this.updateTileTable();
    }
  }

  updateTileTable() {
    this.getTilesList(this.paging.page_number, this.paging.page_size);
  }

  updatePaging() {
    this.paging.page_number = 0;
    this.updateTileTable();
  }







}

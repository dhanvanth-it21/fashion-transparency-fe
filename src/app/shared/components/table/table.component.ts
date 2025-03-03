import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArchive, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faEdit, faExpand, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ CommonModule, FontAwesomeModule, FormsModule,],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input()
  tabelHeader: any[] = [];

  @Input()
  displayData: any[] = [];

  @Input()
  paging: any;

  @Input()
  dataDetailId: string = "";


  @Input()
  dataDetail: any = null;

  @Input()
  allowPagination: {isPaginated: boolean} = {
    isPaginated: true
  }

  @Output()
  dataDetailIdChange = new EventEmitter<string>();

  @Output()
  dataDetailChange = new EventEmitter<string>();

  @Output()
  sortChanged = new EventEmitter<{ sortBy: string, sortDirection: string }>();

  @Output()
  pageChanged = new EventEmitter<number>();

  @Output()
  updateList = new EventEmitter<string>();


  @Output()
  changedPageSize = new EventEmitter<number>();





    iconsUsed = {
      update: faEdit,
      archive: faArchive,
      details: faInfoCircle,
      prev: faArrowLeft,
      next: faArrowRight,
      asc: faArrowDown,
      desc: faArrowUp,
  
    }

    ngOnInit() {
  
    }

  doSorting(sortBy: string, sortDirection: string) {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    this.tabelHeader.filter((data) => {
      data.sortBy === sortBy;
      data.sortDirection = direction;
    })
    this.sortChanged.emit({ sortBy, sortDirection: direction });
  }

  showDetailsOfItemId(id: string) {
    if(this.dataDetailId === id) {
      this.dataDetailId = "";
      this.dataDetail = null;
      return;
    }
    this.dataDetailId = id;
    this.dataDetailIdChange.emit(this.dataDetailId);
  }

  openUpdateList(id: string) {
    this.updateList.emit(id);
  }

  previousPage() {
    if (!this.paging.is_first) {
      this.pageChanged.emit(this.paging.page_number - 1);
    }
  }

  nextPage() {
    if (!this.paging.is_last) {
      this.pageChanged.emit(this.paging.page_number + 1);
    }
  }

  updatePaging(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.paging.page_size = target.value;
    }
    this.pageChanged.emit(0);
    this.changedPageSize.emit(this.paging.page_size);
  }

  setDataDetailId(value: string) {
    this.dataDetailId = value;
    this.dataDetailIdChange.emit(this.dataDetailId);
  }



}

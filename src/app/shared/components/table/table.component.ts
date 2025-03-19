import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArchive, faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faEdit, faExpand, faInfo, faInfoCircle, faLocation } from '@fortawesome/free-solid-svg-icons';

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
  allowPagination: {isPaginated: boolean, pageSize: boolean} = {
    isPaginated: true,
    pageSize: true,
  }

  @Input()
  expandDetail: any[] = [];

  @Input()
  actionButtons: {expand: boolean, edit: boolean, delete: boolean, tracker: boolean} =  {
    expand: true,
    edit: true,
    delete: false,
    tracker: false,
  }

  @Input()
  paymentDetails = false;

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
  orderTracker = new EventEmitter<string>();


  @Output()
  changedPageSize = new EventEmitter<number>();

  @Output()
  paymentEmit = new EventEmitter<string>();





    iconsUsed = {
      update: faEdit,
      archive: faArchive,
      details: faExpand,
      prev: faArrowLeft,
      next: faArrowRight,
      asc: faArrowDown,
      desc: faArrowUp,
      tracker: faLocation
  
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

  openOrderTracker(id: string) {
    this.orderTracker.emit(id);
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


  isDate(value: any): boolean {
    return value instanceof Date || 
           (typeof value === 'string' && isNaN(Number(value)) && !isNaN(Date.parse(value)));
  }
  

  payAmount(id: string) {
    this.paymentEmit.emit(id);
  }



}

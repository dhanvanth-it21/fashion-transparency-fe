import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCustomTable]',
  standalone: true
})
export class CustomTableDirective {

  @Input() data: any[] = []; // The data array
  @Input() columns: { key: string, label: string, sortable?: boolean }[] = []; // Column definitions
  @Input() pageSize: number = 10; // Pagination
  @Input() expandable: boolean = false; // Expandable rows
  @Input() actions: boolean = false; // Show action buttons

  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  
}

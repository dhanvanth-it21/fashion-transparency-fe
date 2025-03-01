import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileDetial } from '../../models/tile.modle';
import { ApiService } from '../../../../shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-tile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './update-tile.component.html',
  styleUrl: './update-tile.component.css'
})
export class UpdateTileComponent {

  @Input()
  tileId!: string;

  @Output()
  closeModal = new EventEmitter<void>();

  tileDetail!: TileDetial;
  tileDetailFormBuilder!: FormGroup;

  constructor(
    private formbulider: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) { }



  ngOnInit() {
    // fetching the tile detail from the api
    this.getTileDetail(this.tileId);

    //this is the formgorup for the tile detail
    this.tileDetailFormBuilder = this.formbulider.group({
      skuCode: [''],
      tileSize: [''],
      brandName: [''],
      modelName: [''],
      color: [''],
      qty: [''],
      piecesPerBox: [''],
      category: [''],
      subCategory: [''],
      finishing: [''],
      minimumStockLevel: [''],
    })
  }

  onSubmit() {
    this.tileDetail = this.tileDetailFormBuilder.value;
    this.updateTileDetail();
  }

  onDiscard() {
    this.closeModal.emit();
  }

  fillDefaultFormBuilder() {
    this.tileDetailFormBuilder.patchValue(this.tileDetail);
  }

  getTileDetail(id: string) {
    this.apiService.getTileDetail(id).subscribe(
      {
        next: (response: any) => {
          if (response.status === "success" && response.data) {
            this.tileDetail = response.data;
            this.fillDefaultFormBuilder();
          }
        },
        error: (e) => { console.log(e) },
      }
    )
  }

  updateTileDetail() {
    this.apiService.updateTileDetail(this.tileId, this.tileDetail).subscribe(
      {
        next: (response: any) => {
          if (response.status === "success" && response.data) {  
            this.closeModal.emit();
          }
        },
        error: (e) => { console.log(e) },
      }
    )
  }


}

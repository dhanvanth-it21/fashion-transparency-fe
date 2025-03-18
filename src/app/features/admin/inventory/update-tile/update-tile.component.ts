import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileDetial } from '../../models/tile.modle';
import { ApiService } from '../../../../shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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

  sizeOptions: string[] = ['SIZE_1X1', 'SIZE_1_5X1', 'SIZE_2X1', 'SIZE_2X2', 'SIZE_3X3', 'SIZE_4X2', 'SIZE_4X4', 'SIZE_6X4', 'SIZE_8X4'];
  categoryOptions: string[] = ['WALL', 'FLOOR'];
  finishingOptions: string[] = ['GLOSSY', 'HIGH_GLOSSY', 'MATT', 'SUGAR', 'CARVING', 'FULL_BODY'];
  subCategoryOptions: { [key: string]: string[] } = {
    WALL: ['KITCHEN', 'BATHROOM', 'ELEVATION'],
    FLOOR: ['INDOOR', 'PARKING', 'ROOFING'],
  };

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
        error: (e) => { console.error(e) },
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
        error: (e) => { console.error(e) },
      }
    )
  }

 


}

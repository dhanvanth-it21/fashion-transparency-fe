import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-tile',
  standalone: true,
  imports: [ RouterModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './add-tile.component.html',
  styleUrl: './add-tile.component.css'
})
export class AddTileComponent {

  @Output()
  closeModal = new EventEmitter<void>();


  newAddTileFormBuilder!: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.newAddTileFormBuilder = this.formBuilder.group({
      tileSize: ['', Validators.required],
      brandId: ['', Validators.required],
      modelName: ['', Validators.required],
      color: ['', Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]],
      piecesPerBox: [null, [Validators.required, Validators.min(1)]],
      category: ['',[Validators.required, Validators.pattern('WALL|FLOOR')]],
      subCategory: ['', [Validators.required]],
      finishing: ['', Validators.required,Validators.pattern('GLOSSY|HIGH_GLOSSY|MATT|SUGAR|CARVINGFULL_BODY')],
      minimumStockLevel: [null, [Validators.required, Validators.min(10)]],
    })

    this.newAddTileFormBuilder.get("category")?.valueChanges.subscribe(
      category => {
        const subCategory  = this.newAddTileFormBuilder.get("subCategory");
        category === "WALL"  ? subCategory?.setValidators([Validators.required, Validators.pattern('KITCHEN|BATHROOM|ELEVATION')]) : 
        subCategory?.setValidators([Validators.required, Validators.pattern('KITCHEN|BATHROOM|ELEVATION')]);
        subCategory?.updateValueAndValidity();
      }
    )
  }

  submitTitle() {
    if(this.newAddTileFormBuilder.valid) {
      console.log(this.newAddTileFormBuilder.value);
      this.closeModal.emit();
    }
    else {
      alert("Please fill in all required fields.");
    }

  }
  
  closeDialog() {
    this.closeModal.emit();
  }



}

import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-tile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-tile.component.html',
  styleUrl: './add-tile.component.css'
})
export class AddTileComponent {
  @Output()
  closeModal = new EventEmitter<void>();

  newAddTileFormBuilder!: FormGroup;

  category: string[] = ["WALL", "FLOOR"];
  subCategory = {
    WALL: ["KITCHEN", "BATHROOM", "ELEVATION"],
    FLOOR: ["INDOOR", "PARKING", "ROOFING"],
  };
  selectedSubCategory: string[] = this.subCategory.WALL;

  finishing: string[] = ["GLOSSY", "HIGH_GLOSSY", "MATT", "SUGAR", "CARVING", "FULL_BODY"];

  constructor(private formBuilder: FormBuilder) {
   
    this.initializeFormGroup();

    this.newAddTileFormBuilder.get("category")?.valueChanges.subscribe((category) => {
      this.selectedSubCategory = this.subCategory[category as keyof typeof this.subCategory] || [];
      this.newAddTileFormBuilder.get("subCategory")?.setValidators([
        Validators.required,
        Validators.pattern(this.selectedSubCategory.join('|'))
      ]);
      this.newAddTileFormBuilder.get("subCategory")?.updateValueAndValidity();
    });
  }

  initializeFormGroup() {
    this.newAddTileFormBuilder = this.formBuilder.group({
      modelName: ['', Validators.required],
      brandName: ['', Validators.required],
      tileSize: ['', Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]],
      piecesPerBox: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      category: ['WALL', Validators.required],
      subCategory: ['', Validators.required],
      finishing: ['', [Validators.required, Validators.pattern(this.finishing.join('|'))]],
      minimumStockLevel: [null, [Validators.required, Validators.min(10)]],
    });
  }

  submitForm() {
    console.log(this.newAddTileFormBuilder.value);
  }

  closeDialog() {
    this.closeModal.emit();
  }
}

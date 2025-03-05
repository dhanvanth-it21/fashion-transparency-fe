import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface FormField {
  key: string;
  label: string;
  type: string;
  options?: string[]; 
  required?: boolean;
  min?: number;
  disabled?: boolean;

}

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css'
})
export class AddFormComponent {

  @Input() 
  formConfig: FormField[] = [];
  @Input() 
  formGroup!: FormGroup;
  @Input() 
  formUse: {heading: string, submit: string, discard: string} = {
    heading: "Form",
    submit: "Submit",
    discard: "Discard"
  };
  @Output() 
  formSubmit = new EventEmitter<any>();
  @Output() 
  formClose = new EventEmitter<void>();


  constructor(private fb: FormBuilder) {}

  submitForm() {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
    }
  }

  closeForm() {
    this.formClose.emit();
  }

  validationMessages = [
    { key: 'required', message: 'This field is required.' },
    { key: 'min', message: 'Quantity must be at least 1.' },
    { key: 'max', message: 'Cannot exceed available stock.' }
  ];
  


}

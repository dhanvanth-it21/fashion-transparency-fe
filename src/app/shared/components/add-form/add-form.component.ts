import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css'
})
export class AddFormComponent {

  @Input()
  formConfig: FormField[] = [];
  @Input()
  formGroup!: FormGroup;
  @Input()
  formUse: { heading: string, submit: string, discard: string } = {
    heading: "Form",
    submit: "Submit",
    discard: "Discard"
  };

  @Input()
  swalAlert: {submitForm: boolean, closeForm: boolean} = {
    submitForm: true,
    closeForm: true
  }


  @Output()
  formSubmit = new EventEmitter<any>();
  @Output()
  formClose = new EventEmitter<void>();


  submitTriggered: Boolean = false;

  constructor(private fb: FormBuilder) { }

  submitForm() {
    this.submitTriggered = true;
    if (this.formGroup.valid) {
      if(this.swalAlert.submitForm) {
        Swal.fire({
          icon: "info",
          title: `Are you sure to ${this.formUse.submit} this`,
          showCancelButton: true,
          confirmButtonText: "OK",
        }).then((result: any) => {
          if (result.isConfirmed) {
            this.formSubmit.emit(this.formGroup.value);
          }
        })
      }
      else {
        this.formSubmit.emit(this.formGroup.value);
      }
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check the Fields",
      });
    }
  }

  closeForm() {
    if(this.swalAlert.closeForm) {
      Swal.fire({
        icon: "info",
        title: "Cancelling the process",
        showCancelButton: true,
        confirmButtonText: "OK",
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.formClose.emit();
        }
      })
    }
    else {
      this.formClose.emit();
    } 
  }

  validationMessages = [
    { key: 'required', message: 'This field is required.' },
    { key: 'min', message: 'Quantity must be at least 1.' },
    { key: 'max', message: 'Cannot exceed available stock.' }
  ];



}

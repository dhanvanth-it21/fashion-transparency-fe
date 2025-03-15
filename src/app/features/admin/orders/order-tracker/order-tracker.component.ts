import { Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth.service';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './order-tracker.component.html',
  styleUrl: './order-tracker.component.css'
})
export class OrderTrackerComponent {

  @Input()
  dataDetailId!: string;

  steps: string[] = ['PENDING', 'PICKING', 'DISPATCHED', 'DELIVERED'];
  currentStepIndex: number = 0;
  orderData: any;

  orderId = ""
  currentStatus = ""
  createdBy = ""
  createdAt = ""
  lastUpdatedAt = ""
  orderTrackerData = [
    {
      completed: false,
      status: "PENDING",
      changedBy: "",
      changedAt: "",
      class: "",
    },
    {
      completed: false,
      status: "PICKING",
      changedBy: "",
      changedAt: "",
      class: "",
    },
    {
      completed: false,
      status: "DISPATCHED",
      changedBy: "",
      changedAt: "",
      class: "",
    },
    {
      completed: false,
      status: "DELIVERED",
      changedBy: "",
      changedAt: "",
      class: "",
    }
  ]




  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.fetchOrderData();
  }



  fetchOrderData(): void {
    this.apiService.getOrderTrackerById(this.dataDetailId).subscribe({
      next: (response: any) => {
        this.orderData = response.data;
        this.fillData();
        this.updateCurrentStepIndex();
      },
      error: (error) => {
        console.error('Error fetching order data:', error);
      }
    });
  }

  updateCurrentStepIndex(): void {
    const currentStatus = this.orderData.currentStatus;
    this.currentStepIndex = this.steps.indexOf(currentStatus) + 1;
  }

  fillData() {
    this.orderId = this.orderData.orderId;
    this.currentStatus = this.orderData.currentStatus;
    this.createdBy = this.orderData.createdBy;
    this.createdAt = this.orderData.createdAt;
    this.lastUpdatedAt = this.orderData.updatedAt;
    this.orderTrackerData = this.orderTrackerData.map(step => {
      const history = this.orderData.statusHistory.find((history: any) => history.status === step.status);
      if (history) {
      return {
        ...step,
        completed: true,
        changedBy: history.changedBy,
        changedAt: history.changedAt,
        class: step.status.toLowerCase(),
      };
      } else {
      return step;
      }
    });
  }
}

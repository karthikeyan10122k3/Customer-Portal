import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '../../core/services/extras/toast/toast.service';
import { CustomerProfile } from '../../core/models/profile/CustomerProfile';
import { CustomerService } from '../../core/services/customer/customer.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [NgIf, ReactiveFormsModule, MatCardModule, MatIcon],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  customerProfileForm: FormGroup;
  isEditing = false;
  profileData!: CustomerProfile;
  isLoading: boolean = true;

  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  constructor() {
    this.customerProfileForm = new FormGroup({
      CustomerNumber: new FormControl('', [Validators.required]),
      CustomerName: new FormControl('', [Validators.required]),
      Language: new FormControl(''),
      CreatedOn: new FormControl(''),
      CreatedBy: new FormControl(''),
      Street: new FormControl(''),
      City: new FormControl(''),
      PostalCode: new FormControl(''),
      Country: new FormControl(''),
      TimeZone: new FormControl(''),
      SalesOrganization: new FormControl(''),
      DistributionChannel: new FormControl(''),
      Currency: new FormControl(''),
      SalesDistrict: new FormControl(''),
    });

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.customerService.getCustomerProfile().subscribe({
      next: (response) => {
        this.profileData = response.data;
        this.customerProfileForm.patchValue(this.profileData);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.showToast('Error fetching Customer Profile', 'error');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.saveProfileData();
    }
  }

  saveProfileData(): void {
  }

  cancelEdit(): void {
    this.isEditing = false;
    // this.customerProfileForm.patchValue(this.profileData);
  }
}

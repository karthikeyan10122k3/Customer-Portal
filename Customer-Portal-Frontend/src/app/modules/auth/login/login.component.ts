import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/extras/toast/toast.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  constructor() {
    this.loginForm = new FormGroup({
      customerId: new FormControl('4', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastService.showToast('Please fill in all required fields', 'error');
      return;
    }

    const formValue = this.loginForm.value;
    
    this.authService.login(formValue).subscribe({
      next: (response) => {
        // Already handled in service
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.toastService.showToast(err.error?.message || 'Server error', 'error');
      }
    });
    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

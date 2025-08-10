import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { ToastService } from '../extras/toast/toast.service';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  login(data: { customerId: string; password: string; rememberMe: boolean }) {
    return this.http
      .post<{ message: string; success: boolean }>(
        'http://localhost:8000/customerPortal/api/auth/login',
        data
      )
      .pipe(
        tap((response) => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          } else {
            this.toastService.showToast(response.message, 'success');
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }
  

  logout(): void {
    this.http.get<{message: string}>('http://localhost:8000/customerPortal/api/auth/logout').subscribe((response) => {
      this.toastService.showToast(response.message, "success")
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<{message: string,name: string; isAuthenticated: boolean }>('http://localhost:8000/customerPortal/api/auth/isAuthenticated')
    .pipe(
      tap((response) => {
        if(!response.isAuthenticated){ 
          this.toastService.showToast(response.message, "error")
          this.router.navigate(['/login']);
        }
      }),
      map(response =>{
        this.userService.setUserName(response.name)
         return response.isAuthenticated
        })
    );
  }
}

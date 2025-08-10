import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastMessageSubject = new BehaviorSubject<string>('');
  private toastTypeSubject = new BehaviorSubject<'success' | 'error'>('success');
  private toastVisibleSubject = new BehaviorSubject<boolean>(false);

  toastMessage$ = this.toastMessageSubject.asObservable();
  toastType$ = this.toastTypeSubject.asObservable();
  toastVisible$ = this.toastVisibleSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 2000) {
    this.toastMessageSubject.next(message);
    this.toastTypeSubject.next(type);
    this.toastVisibleSubject.next(true);

    setTimeout(() => this.toastVisibleSubject.next(false), duration);
  }
}

import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/extras/toast/toast.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  private toastService = inject(ToastService)
  toastType: 'success' | 'error' = 'error';
  toastMessage: string = '';
  toastVisible: boolean = false;

  constructor(){
    this.toastService.toastType$.subscribe((result)=>{
      this.toastType = result
    })
    this.toastService.toastMessage$.subscribe((result)=>{
      this.toastMessage = result
    })
    this.toastService.toastVisible$.subscribe((result)=>{
      this.toastVisible = result
    })
  }

}

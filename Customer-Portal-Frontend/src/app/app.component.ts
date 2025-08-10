import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "./shared/components/toast/toast.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Customer-Portal-Frontend'
  
  private authService = inject(AuthService);
  
  
  ngOnInit(): void {
    this.authService.isAuthenticated()
  }
}
